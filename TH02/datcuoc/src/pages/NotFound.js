import{Link}from"react-router-dom";
const NotFound=() => {
    return(
        <div>
            <h1>404 - Không tìm thấy trang</h1>
            <Link to="/">Về trang chủ</Link>
        </div>
    )
}
export default NotFound