import Swal, { SweetAlertIcon } from "sweetalert2";

export function useFlash() {
    function flash(title: string = 'Error', text: string = 'Confirm', icon: SweetAlertIcon = 'success') {
        return Swal.fire({
            position: 'center',
            title: title,
            text: text,
            showConfirmButton: false,
            icon: icon,
            timer: 1500
        });
    }
    return { flash };
}