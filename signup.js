
const { createClient } = supabase;

const supabaseURL = "https://xwbitrmhxhqiczyplzfk.supabase.co";

// Yahan apni original Supabase anon/publishable key paste karein
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Yml0cm1oeGhxaWN6eXBsemZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzM1MTIsImV4cCI6MjEwNjc0OTUxMn0.mxsYxznrdK2J7Nf1M49pSiOlD1bmCEVLI0GghQlKz8o";

const supabaseclient = createClient(
    supabaseURL,
    supabaseKey
);

// HTML elements
const signupForm = document.getElementById("signupForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");
const signupBtn = document.getElementById("signupBtn");

// Signup function
signupForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (name === "" || email === "" || password === "") {
        message.textContent = "Please fill all fields";
        message.style.color = "red";
        return;
    }

    signupBtn.disabled = true;
    signupBtn.textContent = "Creating Account...";
    message.textContent = "";

    const { data, error } = await supabaseclient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    signupBtn.disabled = false;
    signupBtn.textContent = "Sign Up";

    if (error) {
        message.textContent = error.message;
        message.style.color = "red";
        return;
    }

    console.log("Signup response:", data);

    message.style.color = "green";

    if (data.user && data.user.identities?.length === 0) {
        message.textContent =
            "This email may already be registered. Try logging in.";
        return;
    }

    if (data.session) {
        message.textContent =
            "Account created successfully! You can now open your Todo App.";
        
        signupForm.reset();
    } else {
        message.textContent =
            "Signup successful! Please check your email to verify your account.";
    }

});
