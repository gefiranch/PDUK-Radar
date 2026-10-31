import {getDb} from '../../db';
import employers from '../../data/snapshots/employers.json';
import {caseRepository} from './repository';
export function cases(){return caseRepository(getDb(),Object.fromEntries(employers.employers.map(r=>[r.employer_id,r.verification_status])));}
