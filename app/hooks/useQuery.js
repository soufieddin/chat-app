export default useQuery = ({title, displayName, email}, query) => {
    const mailArr = email.split('@');
    const logn = mailArr[0];
  
  if(title && title.toLowerCase().includes(query) ||  displayName && displayName.toLowerCase().includes(query) || email && logn.includes(query)){
    return true
  }
  return false
};
