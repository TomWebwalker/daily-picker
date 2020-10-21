import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

type Stage = 'ADDING' | 'DAILY';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'daily-picker';
  participants: { name: string; presented: boolean }[] = [];
  stage: Stage = 'ADDING';
  form: FormGroup;
  current: string;

  constructor(private readonly formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
    });
    const cookie = getCookie('participants');
    if (cookie) {
      const participants: { name: string }[] = JSON.parse(cookie);
      participants.map((participant) => this.addParticipant(participant.name));
    }
  }

  setStage(stage: Stage): void {
    this.stage = stage;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.addParticipant(this.form.get('name').value);
    this.form.reset();
    this.form.markAsUntouched();
  }

  clearList(): void {
    this.participants = [];
    document.cookie = `participants=`;
  }

  addParticipant(pname: string): void {
    this.participants.push({
      name: pname,
      presented: false,
    });
    const participants = JSON.stringify(
      this.participants.map(({ name }) => ({ name }))
    );
    document.cookie = `participants=${participants}`;
  }

  pickRandom(): void {
    const notPresented = this.participants.filter(
      (participant) => !participant.presented
    );
    this.current =
      notPresented[Math.floor(Math.random() * notPresented.length)].name;
    const index = this.participants.findIndex(
      (participant) => participant.name === this.current
    );
    this.participants[index] = { name: this.current, presented: true };
  }

  existing(): boolean {
    return (
      this.participants.filter((participant) => !participant.presented).length >
      0
    );
  }

  resetParticipant(name: string): void {
    this.participants.find(
      (particiapnt) => particiapnt.name === name
    ).presented = false;
  }
}

function getCookie(cname: string): string {
  const name = cname + '=';
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let c of ca) {
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}
