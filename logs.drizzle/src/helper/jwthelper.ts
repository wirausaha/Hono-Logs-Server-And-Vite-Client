/*=====================================
| Helper : generateToken
| Logika generate access token dnegan JWT dipindahkan dari login
| agar bisa digunakan konsisten di : handlerefreshtoken.ts atau modul lainnya   
| Author : Fajrie R Aradea
========================================*/import jwt from 'jsonwebtoken';

export function generateToken(userId: string, email: string, userRole: string, companyCode: string, rememberme: number): string {
  const secret = process.env.JWT_SECRET || 'fa3b9bc620714a2aa2fa47709850f7e9';

  const payload = {
    userId,
    email,
    role: userRole,
    companyCode
  };

  return jwt.sign(payload, secret, { expiresIn: rememberme == 0 ? '2m' : '30m' });
}