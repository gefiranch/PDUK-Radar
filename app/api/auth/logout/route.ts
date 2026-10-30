import {eq} from 'drizzle-orm';
import {getDb} from '../../../../db';
import {sessions} from '../../../../db/schema';
import {requireSameOrigin} from '../../../../lib/auth/policy';
import {json,apiError} from '../../../../lib/auth/session';
import {hashToken,sessionCookie} from '../../../../lib/auth/password';
export const dynamic='force-dynamic';
export async function POST(request:Request){try{requireSameOrigin(request);const token=request.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith('pduk_session='))?.slice(13);if(token&&/^[A-Za-z0-9_-]{43}$/.test(token))await getDb().delete(sessions).where(eq(sessions.tokenHash,await hashToken(token)));return json({ok:true},200,{'Set-Cookie':sessionCookie('',request,true)});}catch(e){return apiError(e);}}
