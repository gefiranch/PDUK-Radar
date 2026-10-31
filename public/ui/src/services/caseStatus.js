// Derived operational state. The source risk score and dataset enums stay unchanged.
export const VERIFICATION_STATES={
 'Pending':{label:'Belum diperiksa',caseKey:'awaiting_review',caseLabel:'Belum diperiksa',tone:'neutral',icon:'clock',queue:'active',final:false,message:'Perusahaan ini menunggu pemeriksaan. Prioritas mengikuti skor risiko pada snapshot data.'},
 'Under Review':{label:'Sedang diperiksa',caseKey:'in_progress',caseLabel:'Dalam pemeriksaan',tone:'review',icon:'clock',queue:'active',final:false,message:'Pemeriksaan sedang berlangsung. Perusahaan tetap berada dalam antrean aktif.'},
 'Need More Data':{label:'Perlu data tambahan',caseKey:'awaiting_data',caseLabel:'Menunggu data tambahan',tone:'need',icon:'file',queue:'active',final:false,message:'Pemeriksaan menunggu kelengkapan data. Tinjau catatan dan rencana tindak lanjut sebelum melanjutkan.'},
 'Verified Compliant':{label:'Terverifikasi sesuai',caseKey:'completed_compliant',caseLabel:'Kasus selesai · sesuai',tone:'compliant',icon:'check',queue:'closed',final:true,message:'Perusahaan ini telah selesai diverifikasi dan dinyatakan sesuai berdasarkan hasil pemeriksaan.'},
 'Verified Non-Compliant':{label:'Terverifikasi tidak sesuai',caseKey:'follow_up',caseLabel:'Perlu tindak lanjut',tone:'noncompliant',icon:'alert',queue:'follow_up',final:true,message:'Pemeriksaan menemukan ketidaksesuaian. Diperlukan tindak lanjut. Verifikasi selesai; tindak lanjut belum dinyatakan selesai.'}
};
export const STATUSES=Object.keys(VERIFICATION_STATES);
export const caseForStatus=(status,followUpStatus)=>status==='Verified Non-Compliant'&&followUpStatus==='Completed'?{...VERIFICATION_STATES[status],caseKey:'follow_up_completed',caseLabel:'Kasus selesai · tindak lanjut tuntas',queue:'closed',tone:'compliant',message:'Tindak lanjut telah dituntaskan dengan catatan penyelesaian.'}:VERIFICATION_STATES[status]||VERIFICATION_STATES.Pending;
export const CASE_OPTIONS=STATUSES.map(s=>[caseForStatus(s).caseKey,caseForStatus(s).caseLabel]);
