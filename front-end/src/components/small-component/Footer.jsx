export default function Footer() {
    const now = new Date();
    const currentYear = now.getFullYear();
    return <p style={{ margin: "50px"}}>© {currentYear} Meitoc. All right reserved.</p>
}