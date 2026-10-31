"""Audit CSV fidelity and derived aggregates. Never generates missing history."""
import csv,json,hashlib
from pathlib import Path
from collections import Counter
root=Path(__file__).resolve().parents[1]
idx=json.loads((root/'data/snapshots/employers.json').read_text())
d=json.loads((root/'data/snapshots/dashboard.json').read_text())
details=json.loads((root/'data/snapshots/details.json').read_text())
raw=list(csv.DictReader((root/'data/employers_500.csv').open(encoding='utf-8-sig')))
rows=idx['employers'];checks=[]
def check(name,condition):
    assert condition,name
    checks.append(name)
check('500 rows and unique IDs',len(rows)==500==len({r['employer_id'] for r in rows}))
csv_bytes=(root/'data/employers_500.csv').read_bytes()
provenance=json.loads((root/'data/source-provenance.json').read_text())
check('Repository CSV bytes match pinned SHA-256',hashlib.sha256(csv_bytes).hexdigest()==provenance['repository_csv_sha256'])
# Git main had already normalized the uploaded CRLF CSV to LF before this revision.
# Preserve both hashes and explicitly verify that only newline encoding differs.
original_bytes=csv_bytes.replace(b'\r\n',b'\n').replace(b'\n',b'\r\n')
check('Original CRLF upload SHA-256 matches snapshot provenance',idx['source_sha256']==provenance['original_upload_sha256']==hashlib.sha256(original_bytes).hexdigest())
check('Every CSV value retained',all(all((v=='' and r[k] is None) or str(r[k])==v or isinstance(r[k],(int,float)) and float(v)==r[k] for k,v in a.items()) for a,r in zip(raw,rows)))
check('Risk levels match score boundaries',all(r['risk_level']==('Low' if r['risk_score']<=30 else 'Medium' if r['risk_score']<=60 else 'High' if r['risk_score']<=80 else 'Critical') for r in rows))
check('KPI matches all rows',d['summary']['risk_counts']==dict(Counter(r['risk_level'] for r in rows)))
check('Reference risk counts',d['summary']['risk_counts']=={'Low':369,'Medium':109,'High':16,'Critical':6})
check('Histogram sums to 500',sum(x['count'] for x in d['histogram'])==500)
check('Histogram buckets exact',all(b['count']==sum(b['min']<=r['risk_score']<b['max'] or b['max']==100 and r['risk_score']==100 for r in rows) for b in d['histogram']))
check('Sector totals sum to 500',sum(x['total'] for x in d['sector_risk'])==500)
check('Every sector category exact',all(s['risk_counts']==dict(Counter(r['risk_level'] for r in rows if r['sector']==s['sector'])) for s in d['sector_risk']))
check('Top ten exact',d['top_risk_employers']==sorted(rows,key=lambda r:(-r['risk_score'],r['employer_id']))[:10])
check('Missing workers retained as null',sum(r['actual_workers'] is None for r in rows)==131 and all(r['coverage_ratio'] is None and r['coverage_gap'] is None for r in rows if r['actual_workers'] is None))
check('Peer group min 12',all(r['peer_count']>=12 for r in rows))
check('Data completeness equals available weights',all(abs(r['data_completeness']-(1-(.3 if r['coverage_gap'] is None else 0)-(.1 if r['historical_compliance_score'] is None else 0)))<1e-6 for r in rows))
check('No invented historical data',details['months']==[] and details['employers']=={})
check('No QA internal labels served',not any('INTERNAL_ONLY' in p.name for p in (root/'public').rglob('*')))
report={'passed':len(checks),'checks':checks,'limitations':['Source snapshot has no observed monthly histories, peer percentile, official contributions, flags or evidence. Attached demo enrichment is synthetic and opt-in, not source/model output.'],'provenance':provenance,'risk_counts':d['summary']['risk_counts'],'high_critical':sum(r['risk_score']>60 for r in rows)}
(root/'docs/data-validation.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
