import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { AppState } from '../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Http, Headers } from '@angular/http';
import { JwtHelper } from 'angular2-jwt';
import { HomeService } from './home.service';

@Component({

  selector: 'home',
  providers: [

  ],
  styleUrls: [ './home.style.css' ],
  templateUrl: './home.template.html'
})
export class Home {
  bilikStatus = false;

  localState = { value: '' };
  data = 'IniBuatKitaLoh';

  loading = false;
  log = false;
  nama;
  nim;

  pilihanKm = 0;

  pilihanFmipa = 0;

  km;
  fmipa;

  pilihKm1 = false;
  pilihKm2 = false;

  pilihFmipa1 = false;
  pilihFmipa2 = false;

  // PILIHAN
  namaKm = '-';
  namaFmipa = '-';


  token;
  test = false;
  jwtHelper: JwtHelper = new JwtHelper();
  private login = {'username' : '', 'password': ''};
  private bilik = {'username' : '', 'password': ''};

  qr = false;
  qrcode;

  constructor(public service: HomeService, public appState: AppState, public toastr: ToastsManager, public router: Router, private route: ActivatedRoute, private http: Http) {

    this.km = service.bemKm;
    this.fmipa = service.fmipa;

  }

  ngOnInit() {
    this.token = localStorage.getItem('id_token');

    if (this.token) {
      let decoded = this.jwtHelper.decodeToken(this.token);
      this.nama = decoded.nama;
      this.nim = decoded.nim;
      this.log = true;
      this.loading = false;
    }

    else {
      this.log = false;
    }

  }

  cekBilik() {
    if (this.bilik.username == 'userBilik' && this.bilik.password == 'passwordBilikBangetNih') {
      console.log('berhasil');
    }

    else {
      console.log('gagal broh!');
    }
  }

  showSuccess() {
    this.toastr.success('Login Berhasil', 'Success!');
  }

  showError(text) {
    this.toastr.error(text, 'Error!');
  }

  reset() {
    this.login.username = '';
    this.login.password = '';
  }

  submit() {
    this.loading = true;
    let status = false;
    let creds = JSON.stringify({username: this.login.username, password: this.login.password, magic: this.data});

    this.http.post('http://test.agri.web.id/api/loginFem_2.php', creds)
      .map(res => res.json())
      .subscribe(data => {
        if (data) status = true;
        if (data.status) {
          localStorage.setItem('id_token', data.token);
          let decoded = this.jwtHelper.decodeToken(data.token);
          this.nama = decoded.token;
          this.nim = decoded.nim;
          this.log = true;
          this.showSuccess();
          this.loading = false;
        }
        else {
          localStorage.clear();
          this.loading = false;
          this.showError(data.message);

        }

    });

    setTimeout(() => {
      if (!status) {
        this.showNoConn();
        this.log = false;
        this.loading = false;
        localStorage.clear();
      }
    }, 5000)

  }

  showNoConn() {
    this.toastr.error('Connection Time Out', 'Error!');
  }

  pilih(pilih) {
    this.token = localStorage.getItem('id_token');
    let decoded = this.jwtHelper.decodeToken(this.token);
    this.nama = decoded.nama;
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers.append('Authorization', this.token);
    let creds = JSON.stringify({vote : pilih});

    this.http.post('http://test.agri.web.id/api/voteFem', creds, {headers: headers})
      .map(res => res.json())
      .subscribe(data => {

        console.log('status :'+data['status']);
        if(data['status']) {
          this.showSuccessMilih();
          this.qrcode = data['data'];
          this.qr = true;

          setTimeout(() => {
            localStorage.clear();
            this.log = false;
            this.qrcode = '';
            this.qr = false;
          }, 20000)
        }

        if(!data['status']) {
          this.showGagalMilih(data['message']);

          localStorage.clear();
          this.log = false;

        }


      })

  }

  keluar() {
    localStorage.clear();
    this.log = false;
    this.qrcode = '';
    this.qr = false;
  }

  showSuccessMilih() {
    this.toastr.success('Anda Berhasil Memilih', 'Success!');
  }

  showGagalMilih(pesan) {
    this.toastr.error(pesan, 'Error!');
  }


}
