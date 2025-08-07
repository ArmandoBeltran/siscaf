

function DropSelect({name,onChange , value, data, labelKey="nombre", idkey }) {
      
  if (data !== null){
    return (
    
    <select className="form-select" name={name} onChange={onChange} value={value}>
      <option value="">[SELECCIONA]</option>
      {data.map(item => (
        <option key={item[idkey]} value={item[idkey]}>
          {item[labelKey]}
        </option>
      ))}
    </select>
  );
  }
  
}


export default DropSelect