import {esc} from '../utils/formatters.js';

export function accountProfile(user){
 const name=user.name?.trim()||'Pengguna';
 const initials=name.split(/\s+/).map(word=>Array.from(word)[0]).slice(0,2).join('').toUpperCase();
 const role=user.role==='admin'?'Admin':'User';
 return `<div class="account-summary" aria-label="Akun ${esc(name)}, ${role}"><span class="avatar account-avatar" aria-hidden="true">${esc(initials)}</span><div class="user-label"><strong title="${esc(name)}">${esc(name)}</strong><span class="account-role">${role}</span></div></div>`;
}

export function logoutMessage(hasUnsavedChanges=false){
 return `<p>Anda akan kembali ke halaman masuk.</p>${hasUnsavedChanges?'<div class="notice warn logout-draft-warning">Perubahan yang belum disimpan akan hilang.</div>':''}`;
}
