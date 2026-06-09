// DEAD CODE - order detail is at /admin/orders/[id]. Remove with: git rm -r app/admin/order-detail/
import { redirect } from "next/navigation"
export default function OrderDetailRedirect() { redirect("/admin/orders") }
