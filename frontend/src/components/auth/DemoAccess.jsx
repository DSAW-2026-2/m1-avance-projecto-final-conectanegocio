import { demoUsers } from '../../data/demoUsers.js';
import { distributors, stores } from '../../data/organizations.js';

export default function DemoAccess() {
  return (
    <details className="demo-access">
      <summary>Ver cuentas y códigos de demostración</summary>
      <p>Solo datos ficticios. No uses contraseñas ni información personal reales.</p>
      <ul>
        {demoUsers.map((user) => (
          <li key={user.id}><strong>{user.role}{user.subRole ? ` / ${user.subRole}` : ''}</strong>: {user.email}</li>
        ))}
      </ul>
      <p>Contraseña de todas las cuentas demo: <code>{demoUsers[0].password}</code></p>
      <p>Códigos de tiendas: {stores.map((item) => `${item.name}: ${item.companyCode}`).join(' · ')}</p>
      <p>Códigos de distribuidores: {distributors.map((item) => `${item.name}: ${item.companyCode}`).join(' · ')}</p>
    </details>
  );
}
