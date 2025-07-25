export async function login(email, password) {
    const configuraciones = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({
            email: email,
            password: password
        })
    };

    try {
        const res = await fetch("http://localhost:5000/api/users/post/login", configuraciones);

        if (!res.ok) {
            throw new Error(`Error ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();

        return result; // ya es un objeto
    } catch (err) {
        console.error("Error al obtener datos:", err.message);
        throw err;
    }
}
