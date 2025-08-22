import Swal from "sweetalert2";

export function useSwal() {
    const showAlert = (options) => Swal.fire(options);

    const showSuccess = (message) =>
        showAlert({
            title: "Success!",
            text: message,
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });

    const showError = (message) =>
        showAlert({
            title: "Error Encountered",
            text: message,
            icon: "error",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
        });

    const showConfirm = (message) =>
        showAlert({
            title: "Are you sure?",
            text: message,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        });

    return { showSuccess, showError, showConfirm };
}
