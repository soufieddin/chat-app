export default useQuery = ({title}, query) => {

if(title && title.toLowerCase().includes(query)){
  return true
}
return false
};