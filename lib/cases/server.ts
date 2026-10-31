import {env} from 'cloudflare:workers';
import employers from '../../data/snapshots/employers.json';
import {caseRepository} from './repository';
export function cases(){if(!env.DB)throw Error('D1 DB binding unavailable');return caseRepository(env.DB,Object.fromEntries(employers.employers.map(r=>[r.employer_id,r.verification_status])));}
