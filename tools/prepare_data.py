"""Convert the uploaded CSV snapshot without creating records or reconstructing history."""
import csv,json,hashlib,collections
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'data/employers_500.csv'
STRINGS={'employer_id','sector','region','company_scale','risk_level','verification_status','peer_group_level','data_quality'}
INTS={'active_participant','actual_workers','peer_count','stagnation_months'}
rows=[]
for raw in csv.DictReader(src.open(encoding='utf-8-sig')):
    row={}
    for k,v in raw.items():
        row[k]=v if k in STRINGS else None if v in ('','null','None') else int(v) if k in INTS else float(v)
    rows.append(row)
meta={'schema_version':'1.0.0','dataset_id':'pduk-radar-uploaded-csv-v1','source_format':'csv_snapshot','source_file':'employers_500.csv','snapshot_month':'2025-12','synthetic':True,'source_sha256':hashlib.sha256(src.read_bytes()).hexdigest(),'limitations':['Paket JSON asli, adapter, dan schema tidak dilampirkan. JSON website dikonversi transparan dari CSV yang diunggah.','Histori 24 bulan, peer_percentile, kontribusi skor, rule flags, dan catatan verifikasi awal tidak tersedia.','Skor dan status awal dipertahankan persis dari CSV; tidak ada pelatihan ulang model atau regenerasi perusahaan.']}
counts=dict(collections.Counter(r['risk_level'] for r in rows))
hist=[{'min':a,'max':a+10,'count':sum(a<=r['risk_score']<a+10 or a==90 and r['risk_score']==100 for r in rows),'label':f'{a}–{a+10}'} for a in range(0,100,10)]
sectors=[{'sector':s,'total':sum(r['sector']==s for r in rows),'risk_counts':dict(collections.Counter(r['risk_level'] for r in rows if r['sector']==s))} for s in sorted({r['sector'] for r in rows})]
dash={**meta,'summary':{'total_employers':len(rows),'risk_counts':counts},'histogram':hist,'sector_risk':sectors,'top_risk_employers':sorted(rows,key=lambda r:(-r['risk_score'],r['employer_id']))[:10]}
for name,obj in [('employers.json',{**meta,'employers':rows}),('dashboard.json',dash),('details.json',{**meta,'months':[],'employers':{}})]:
    (ROOT/'data/snapshots'/name).write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'rows':len(rows),'risk_counts':counts,'history_months_available':0,'source_sha256':meta['source_sha256']}))
