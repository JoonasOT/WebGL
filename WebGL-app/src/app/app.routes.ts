import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        loadComponent: () => {
            return import("./home/home.component").then(m => m.HomeComponent);
        },
    },
    {
        path: "canvas",
        loadComponent: () => {
            return import("./canvas/canvas.component").then(m => m.CanvasComponent);
        },
    },

];
