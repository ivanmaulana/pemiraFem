import { Injectable } from '@angular/core';

@Injectable()

export class HomeService {

  constructor() {

  }

  public bemKm = [
    {
      'id' : 1,
      'nama' : 'Joko Widodo - Jusuf Kalla',
      'quote' : 'Indonesia Hebat'
    },
    {
      'id' : 2,
      'nama' : 'Prabowo Subianto - Hatta Radjasa',
      'quote' : 'Selamatkan Indonesia'
    },
  ]

  public fmipa = [
    {
      'id' : 1,
      'nama' : 'JKW - JK',
      'quote' : 'Indonesia Hebat'
    },
    {
      'id' : 2,
      'nama' : 'PB - HT',
      'quote' : 'Selamatkan Indonesia'
    },
  ]


}
