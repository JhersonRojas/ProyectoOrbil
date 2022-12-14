import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProyectorService } from '../../services/proyector.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Dato } from 'src/app/interface/interface';

@Component({
  selector: 'app-proyector',
  templateUrl: './proyector.page.html',
  styleUrls: ['./proyector.page.scss'],
})

    // <-- Clase para el modulos de proyectores -->
export class ProyectorPage implements OnInit {

  permiso: boolean = false 
    rol: string  
    usuario:string 
    identificacion: string 

  form: FormGroup; // <-- "form", variable que guarda los datos recibidos del formulario desde el HTML -->

    // <-- "nombre" e "id", guardan los datos del LocalStorage en esta modulo -->
        // <--- El localStorage es un almacenamiento interno, este tiene guardados los datos del usuario que accedio --->
  nombre= localStorage.getItem('usuario');
  id = localStorage.getItem('identificacion');

  fechaHoy:Date = new Date();     // <-- Esta variable recibe la fecha actual, esto es un componente propio de angular -->
  
  proyectores: any; // <-- "proyectores" es la variable que guarda los datos recibidos del servicio al Api Rest --->
  proyector: Dato[] = [];

    // <-- "respuesta", regresa la respuesta del servidor -->
  respuesta:  any;
    secreto: any 

    // <---------- Aqui se alamacena individualmente los datos que son insertados en el formulario, esto desde la variable "form" ------------>
  todo:       any; // <--- Esta variable agrupa los datos para enviarlos --->
    serial:   any; // <--- Esta variable toma el serial del proyector elegido del HTML --->
    fecha:    any; // <--- Esta variable toma la fecha elegida desde el formulario del HTML --->
    jornada:  any; // <--- Esta variable toma la jornada elegida desde el formulario del HTML --->
    sitio:    any; // <--- Esta variable toma el sitio diligenciado en el formulario del HTML --->
  
    // <----------------- El constructor obtiene los parametros importados de diferentes componentes ------------------->
  constructor(
    private service: ProyectorService, // <-- "service" obtiene los servicios proporcionados desde proyectores service -->
    private NgFb: FormBuilder, // <-- "NgFb" me proporciona una funci??n propia de angular para agrupar informaci??n traida desde algun formulario del HTML -->
    private NgRouter: Router, // <--  NgRouter" es una funci??n de angular que me permite redirigir al usuario a otra ruta por medio de una orden -->
    private NgAlert: AlertController // <--"NgAlert" es una componente de angular que me permite presentar ventanas emergentes con informaci??n en las vistas -->
  ) {}
  
    // <-- Funci??n de angular, su contenido es lo primero que se ejecuta al entrar a esta vista -->
  ngOnInit() {
      // <-- Esta funci??n es la que realiza el llamado al servicio, este ejecuta la consulta al servidor -->
    this.service.Listar_Proyectores_Service().subscribe(
    resp => { 
      this.proyectores = ( resp ) 
      this.proyector = ( resp.datos )
    });

      // <-- "form" a??ade los datos en el momento que alguien diligencie el formulario en la vista -->
    this.form = this.NgFb.group({
        fecha   : ['', Validators.required],
        jornada : ['', Validators.required],
        serial  : ['', Validators.required],
        sitio   : [''],
      });   
    
      // <--  Ejecuta la validaci??n de lo datos del usuario -->
    return this.ValidarDatos()
  }

    // <-- Funci??n que permite enviar un mensaje emergente al realizarse una reserva -->
  async mostrarAlerta(msj: string ) {
    const alert = await this.NgAlert.create({ message: msj});
    await alert.present();
  }

    // <-- Muestra una ventana para confirmar la reserva y regresa una respuesta -->
  async confirmReserve() {
    const alert = await this.NgAlert.create({
      header: `Confirmar la reserva?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const confirm = await alert.onDidDismiss();

    if ( confirm.role == 'confirm') return this.Reserve();

  }

    // <-- Esta funci??n envia los datos previamente recibidos del formulario del HTML y los envia al servidor -->
  async Reserve(){
      // <-- Estos son los datos que se envian a las variables antes mencionadas -->
    this.fecha = this.form.value.fecha
    this.jornada = this.form.value.jornada
    this.serial = this.form.value.serial
    this.sitio = this.form.value.sitio

    this.todo = { usuario : this.id, 
                  jornada : this.form.value.jornada,
                  fecha   : this.fecha,
                  serial  : this.form.value.serial,
                  sitio   : this.form.value.sitio 
                };
          
      // <-- Este segmento recopila los datos de la reserva y los envia, tambien recive la respuesta del Api Rest --->  
    this.service.Reservar_Proyector_Service(this.todo).subscribe(
       resp => {
        this.respuesta = (resp)
          
          // <-- Aqui tambien se envia el mensaje en caso de que la reserva sea valida o no --->
        if ( resp === undefined ) return this.mostrarAlerta('No se encuentra conectado al servidor')          
        if (this.respuesta.confirm == true ) return this.mostrarAlerta(`Ha reservado el ambiente en ${this.fecha.split('T', 1)[0]}`)
        if (this.respuesta.confirm == false ) return this.mostrarAlerta(`Ya reservaron este proyector aqui, lo sentimos ????`)
        return this.mostrarAlerta('No se reconoce la respuesta del servido')
      }
    );

  }

    // <-- Esta funci??n valida si los datos del usuario exiten, de no, lo regresara al login -->
  async ValidarDatos(){
    try { 
      let token = localStorage.getItem('token')
      if (token){
        this.rol = localStorage.getItem('tipo_usuario')
        this.usuario = localStorage.getItem('usuario')
        this.identificacion = localStorage.getItem('identificacion')

          if(this.rol == "Instructor" || this.rol == "Administrativo") 
            {this.permiso = true } else { this.permiso = false}

      } else {this.NgRouter.navigate(['/login'])}
    } catch (error){}
  }

    // <-- Funci??n que cancela la posibilidad de elegir fines de semana en el calendario desplegable -->
  cancelarFinDeSemana = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };

  async logout() {
    const alert = await this.NgAlert.create({
      header: `Desea cerrar sesi??n?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Confirmar',
          role: 'confirm',
        },
      ],
    });
    await alert.present();
    const confirm = await alert.onDidDismiss();

    if ( confirm.role == 'confirm') {
      const close = async () => {
        localStorage.clear()
        this.NgRouter.navigate(['/login'])
        await location.reload()
      }
      return close();
    }
  }
} // Este es el cierre de la clase de proyector 