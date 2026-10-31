import {getSession,json,apiError} from '../../../../lib/auth/session';
import {requireSameOrigin,AccessError} from '../../../../lib/auth/policy';
import {readCaseBody} from '../../../../lib/cases/policy';
import {cases} from '../../../../lib/cases/server';
export const dynamic='force-dynamic';
type Context={params:Promise<{id:string}>};
export async function GET(request:Request,{params}:Context){try{await getSession();const {id}=await params;const raw=new URL(request.url).searchParams.get('before');if(raw!==null&&(!/^\d+$/.test(raw)||!Number.isSafeInteger(Number(raw))||Number(raw)<1))throw new AccessError(400,'Cursor riwayat tidak valid.');return json({record:await cases().detail(id,raw===null?undefined:Number(raw))});}catch(e){return apiError(e);}}
export async function PATCH(request:Request,{params}:Context){try{const {user}=await getSession();requireSameOrigin(request);const {id}=await params;return json({record:await cases().save(id,await readCaseBody(request),user)});}catch(e){return apiError(e);}}
