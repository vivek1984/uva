export default function ApplicationLogo({ className, ...props }) {
    return (
        <img
            src="/storage/logo.jpg"
            alt="UVA Vyapari Welfare Association"
            className={className}
            {...props}
        />
    );
}
