import employers from '../../../../data/snapshots/employers.json';
import dashboard from '../../../../data/snapshots/dashboard.json';
import details from '../../../../data/snapshots/details.json';
import {getSession,json,apiError} from '../../../../lib/auth/session';
export const dynamic='force-dynamic';
const files:Record<string,unknown>={'employers.json':employers,'dashboard.json':dashboard,'details.json':details};
export async function GET(_request:Request,{params}:{params:Promise<{file:string}>}){try{await getSession();const {file}=await params;return Object.hasOwn(files,file)?json(files[file]):json({error:'Data tidak ditemukan.'},404);}catch(e){return apiError(e);}}
