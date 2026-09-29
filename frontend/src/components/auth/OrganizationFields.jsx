import { distributors, stores } from '../../data/organizations.js';
import { isDistributorRole, isEmployee, isStoreRole, subRoles } from '../../utils/identity.js';
import FormField from '../common/FormField.jsx';

const subroleLabels = { cashier: 'Caja', inventory: 'Inventario', sales: 'Ventas', logistics: 'Logística' };

export default function OrganizationFields({ form, errors, onChange }) {
  const storeRole = isStoreRole(form.role);
  const distributorRole = isDistributorRole(form.role);
  if (!storeRole && !distributorRole) return null;
  const organizations = storeRole ? stores : distributors;
  const organizationKey = storeRole ? 'storeId' : 'distributorId';
  const options = organizations.map(({ id, name }) => ({ value: id, label: name }));
  const subroleOptions = isEmployee(form.role)
    ? subRoles[form.role].map((value) => ({ value, label: subroleLabels[value] })) : [];
  return (
    <>
      <FormField label={storeRole ? 'Tienda' : 'Distribuidor'} name={organizationKey}
        value={form[organizationKey]} onChange={onChange} error={errors[organizationKey]} options={options} />
      <FormField label="Código de empresa (demo)" name="companyCode" value={form.companyCode}
        onChange={onChange} error={errors.companyCode} autoComplete="off" />
      {isEmployee(form.role) && (
        <FormField label="Subrol" name="subRole" value={form.subRole} onChange={onChange}
          error={errors.subRole} options={subroleOptions} />
      )}
    </>
  );
}
