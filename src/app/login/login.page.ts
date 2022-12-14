import { Component, OnInit } from '@angular/core';
import { Validators,FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { ToastController } from '@ionic/angular';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})

export class LoginPage implements OnInit {

  public form: FormGroup; // <-- "form" variable que guarda los datos recibidos de "NgFb" desde el HTML -->

  public acceso: string; // <-- Variables donde se guarda los datos del usuario, estos se envian al Api Rest para ser validados -->
    private identificacion: string;
    private nombre: string;
    public clave: string;
    private tipo_usuario: string;

    // <-- Al enviarse los datos se recibe una respuesta, esta respuesta la almacenan estas variables -->
  public respuesta: any = [];
    private token: string;

    // <-- El constructor obtiene los parametros importados de diferentes componentes -->
  constructor(
    private service: LoginService, /* "service" obtiene los datos proporcionados desde services/login.service */
    private NgFb: FormBuilder, /* "NgFb", Componente de angular para agrupar información traida desde algun formulario del HTML */
    private NgRouter: Router, /* "NgRouter", Componente angular que me permite redirigir al usuario a otra ruta por medio de una orden */
    private NgMenu: MenuController, /* "NgMenu" me permite controlar el manejo del menú desplegable, como mostrarlo o no */
    private NgToast: ToastController, /* "NgToast", componente de angular que permite presentar ventanas emergentes con información en la vista*/
    ) {}

    // <-- Función de angular que se ejecuta al iniciarse esta pagina -->
  ngOnInit() {
    this.NgMenu.enable(false); // <-- Bloqueo del menú desplegable en esta vista -->
    this.checkToken(); // <-- Llamado a la función que valida si hay o no Token -->
    this.form = this.NgFb.group({  // <--"NgFb.group()" añade los datos en el momento que alguien diligencie el formulario en la vista -->
      user: ['', Validators.required],
      pass: ['', Validators.required]
    });
  };

    // <-- Verificar el token, si existe en la App, enviara al usuario a la pagina siguiente -->
  checkToken(){
    if (localStorage.getItem('token')) this.NgRouter.navigate(['/home'])
    if (!localStorage.getItem('token')) this.NgRouter.navigate(['/login'])
  }

    // <-- Mensaje en caso de querer acceder -->
  async msjToast(msj: string) {
    const toast = await this.NgToast.create({
      message: msj, 
      duration: 2500,
      position: 'bottom', 
      mode: 'ios', 
    });
    toast.present();
  }

    // <-- Función que envia los datos del formulario al servidor para su validación -->
  async ValidacionDeDatos(){
    try{
      const ingreso = this.service.Login_Service(this.form.value).subscribe(
        async resp => {

          if ( resp === undefined ) return this.msjToast('No se encuentra conectado al servidor')          
          if ( resp.confirm == false ) return this.msjToast('Contraseña o usuario incorrecto')

          this.respuesta = (resp);
          this.token = (resp.token);

          return this.Restric(resp.user.Tipo_Usuario)
      })
      return ingreso;  

    } catch (error) { console.log(error) }
  }

    // <-- "Restric", compara el cargo del usuario y valida si es aceptado o no por el App -->
  public async Restric( cargo: string ) {
    const roles = {
      "Aprendiz":           "Aprendiz",
      "Donado":             "Aprendiz",
      "Instructor":         "Instructor",
      "Administrativo 1":   "Administrativo",
      "Administrativo 2":   "Administrativo", 
      "Administrativo 3":   "Administrativo", 
      "Auxiliar aseo":      "Administrativo", 
      "Operarios":          "Administrativo", 
      "Giras Especiales":   "Administrativo", 
      "Visitas":            "Visitante",
      "Aprendiz Visitante": "Visitante" 
    }

      // <-- En caso de reconocer el cargo, el sistema lo guardara en el almacenamiento interno -->
    await roles[cargo] ?? this.msjToast('No se reconoce el cargo');

    this.identificacion = this.respuesta.user.Pk_Identificacion,
      localStorage.setItem('identificacion', this.identificacion);

    this.nombre = this.respuesta.user.Nombre,          
      localStorage.setItem('usuario', this.nombre);

    this.tipo_usuario = roles[cargo],
      localStorage.setItem('tipo_usuario', this.tipo_usuario);

      localStorage.setItem('token', this.token);

    this.NgRouter.navigate(['/home'])

    return setTimeout( async () => { location.reload() }, 40) 
  }
}