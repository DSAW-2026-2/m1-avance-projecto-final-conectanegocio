export default function Notice({ notice }) {
  if (!notice) return null;
  return <p className={notice.kind === 'error' ? 'form-error' : 'form-success'} role={notice.kind === 'error' ? 'alert' : 'status'}>{notice.message}</p>;
}
