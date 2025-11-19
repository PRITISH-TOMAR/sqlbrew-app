import { createSlice } from "@reduxjs/toolkit";

const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;


const initialTheme = localStorage.getItem("theme") || (systemPrefersDark ? "dark" : "light");

const applyTheme = (theme) => {
    const root = document.documentElement;
    if (theme === "dark") {
        root.classList.add("dark");
    } else {
        root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
};

applyTheme(initialTheme);

const themeSlice = createSlice({
    name: "theme",
    initialState: initialTheme,
    reducers: {
        toggleTheme: (state) => {
            const newTheme = state === "light" ? "dark" : "light";
            applyTheme(newTheme);
            return newTheme;
        },
        setTheme: (state, action) => {
            applyTheme(action.payload);
            return action.payload;
        }
    },
});

export const { theme, toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
