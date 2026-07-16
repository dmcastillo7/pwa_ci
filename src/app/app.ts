import { Component, HostListener, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

//Modelo para representar una tarea
interface Tarea {
  texto: string;
  completada: boolean
}

const STORAGE_KEY = 'taskmaster_tareas';

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  titulo = 'TaskMaster Pro';
  nuevaTarea = '';
  estaOnline = navigator.onLine;
  tareas: Tarea[] = [];

  ngOnInit(): void {
    this.cargarTareas();
    console.log('[App] Aplicación iniciada');
    console.log('[App] Estado de conexión: ', this.estaOnline ? 'En línea' : 'Sin conexión');

    // Verificar si el navegador soporta service workers
    if ('serviceWorker' in navigator) {
      console.log('[App] El navegador soporta service workers');
      navigator.serviceWorker.ready.then((registro) => {
        console.log('[App] Service worker registrado con éxito:', registro);
      });
    } else {
      console.warn('[App] El navegador no soporta service workers');
    }
  }

  // Se ejecuta cuando el navegador vuelve a tener conexión
  @HostListener('window:online')
  cuandoVuelveInternet() {
    this.estaOnline = true;
    console.log('[App] La aplicación ha vuelto a estar en línea');
  }

  // Se ejecuta cuando el navegador pierde la conexión
  @HostListener('window:offline')
  cuandoSeVaInternet() {
    this.estaOnline = false;
    console.log('[App] La aplicación ha perdido la conexión a Internet');
  }

  // Método para agregar una nueva tarea
  agregarTarea() {
    const textoLimpio = this.nuevaTarea.trim();
    if (textoLimpio.length === 0) {
      console.log('[App] No se agregó la tarea porque el texto está vacío');
      return;
    }

    this.tareas.push({ texto: textoLimpio, completada: false });
    console.log('[App] Tarea agregada: ', textoLimpio);
    this.nuevaTarea = '';
    this.guardarTareas();
  } 

  cambiarEstadoTarea(tarea: Tarea) {
    tarea.completada = !tarea.completada;
    console.log('[App] Estado de la tarea cambiado: ', tarea);
    this.guardarTareas();
  }

  eliminarTarea(indice: number) {
    const tareaEliminada = this.tareas[indice]; 
    this.tareas.splice(indice, 1);
    console.log('[App] Tarea eliminada: ', tareaEliminada);
    this.guardarTareas();
  }

  // Persistencia con LocalStorage
  private guardarTareas(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tareas));
      console.log('[App] Tareas guardadas en LocalStorage');
    } catch (e) {
      console.error('[App] Error al guardar tareas en LocalStorage:', e);
    }
  }

  private cargarTareas(): void {
    try {
      const datos = localStorage.getItem(STORAGE_KEY);
      if (datos) {
        this.tareas = JSON.parse(datos);
        console.log('[App] Tareas cargadas desde LocalStorage:', this.tareas.length, 'tareas');
      } else {
        this.tareas = [
          { texto: 'Revisar manifest de la PWA', completada: false },
          { texto: 'Revisar service worker', completada: false },
          { texto: 'Probar la aplicación sin conexión', completada: false }
        ];
        this.guardarTareas();
        console.log('[App] Tareas iniciales por defecto guardadas en LocalStorage');
      }
    } catch (e) {
      console.error('[App] Error al cargar tareas desde LocalStorage:', e);
      this.tareas = [];
    }
  }
}
