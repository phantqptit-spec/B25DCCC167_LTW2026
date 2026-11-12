import{NavLink}from"react-router-dom";
const NavBar=() => {
    return(
        <nav><NavLink to="/">Trang chủ</NavLink>
        <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>
        <NavLink to="/history">Lịch sử</NavLink>
        </nav>
    )
}
export default NavBar