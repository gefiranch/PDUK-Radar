import {getSession,json,apiError} from '../../../lib/auth/session';
import details from '../../../data/demo/demo_details_500.json';
import verifications from '../../../data/demo/demo_verifications_500.json';
import scenarios from '../../../data/demo/demo_scenarios.json';
export const dynamic='force-dynamic';
// Explicit opt-in demo endpoint. Never merged into the immutable source or D1 case state.
export async function GET(){try{await getSession();return json({details,verifications,scenarios});}catch(e){return apiError(e);}}
