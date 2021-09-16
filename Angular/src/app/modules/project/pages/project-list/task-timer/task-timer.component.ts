import { Component, OnInit, EventEmitter, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ITask } from './models/task';
import { NotifyService } from 'src/app/modules/workdiary/services/notify.service';
import { ProjectService } from 'src/app/_services/project.service';

declare function startCapture(displayMediaOptions, callback): any;
declare function captureSnapShot(videoElement): any;
declare function stopCapture(videoElement): any;

@Component({
  selector: 'app-task-timer',
  templateUrl: './task-timer.component.html',
  styleUrls: ['./task-timer.component.scss']
})
export class TaskTimerComponent implements OnInit {
  task: ITask;
  breaktask:ITask;
  action: string;
  servertimer: any;
  captureTimer: any;

  // The index of the task within the containing list.
  index: number;
  deleted: EventEmitter<number>;
  stopped: EventEmitter<number>;

  timer: number;
  // The formatted time to be displayed.
  prettyTime: string;
  //BreakTime
  breakTime: string;
  // Show whether the timer is running.
  isActive: boolean;
  // Determines whether the task can be stopped or whether the timer can be reset.
  canBeStopped: boolean;

  videoElement: HTMLElement;
  showError: boolean;
  errorMessage: string = '';

  constructor(public projectService: ProjectService,
    private notifyService: NotifyService,
    public dialog: MatDialogRef<TaskTimerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.deleted = new EventEmitter<number>();
    this.stopped = new EventEmitter<number>();

    // Add a task when a new task has been created.

    this.notifyService.taskAdded.subscribe((task: ITask) => {
      this.task = task;
      this.breaktask=this.breaktask;
      this.setPrettyTime();
      this.setBreakTime();
      this.canBeStopped = !(this.task.time.hours === 0 && this.task.time.minutes === 0 && this.task.time.seconds === 0);
      this.canBeStopped=!(this.breaktask.time.hours===0 && this.breaktask.time.minutes===0 && this.breaktask.time.seconds===0);
      console.log(this.task)
    }, error => {
      console.log(error);
    });

    // Pause all other tasks when a new task is started.
    this.notifyService.taskStarted.subscribe((id: number) => {
      if (id !== this.task.id) {
        this.pauseTimer();
      }
    });
  }

  ngOnInit() {
    const atask: ITask = {
      id: this.data.id,
      name: this.data.taskDescription,
      project: '',
      isCurrent: true,
      time: {
        hours: 0,
        minutes: 0,
        seconds: 0
      }
    };
    this.notifyService.announceTaskAdded(atask);
    this.isActive = false;
  }

  /**
   * Sets the formatted time to be displayed.
   */
  setPrettyTime(): void {
    this.prettyTime = this.determinePrettyTime();
    
  }

  setBreakTime(): void{
    this.breakTime=this.determineBreakTime();
  }

  determineBreakTime():string{
    return `${this.padTime(this.task.time.hours)}:${this.padTime(this.task.time.minutes)}:${this.padTime(this.task.time.seconds)}`;
  }

  /**
   * Sets the format of the displayed time.
   */
  determinePrettyTime(): string {
    return `${this.padTime(this.task.time.hours)}:${this.padTime(this.task.time.minutes)}:${this.padTime(this.task.time.seconds)}`;
  }

  /**
   * Pads an integer time value with a leading 0 if it is smaller than 10.
   * @param time The integer time value.
   */
  padTime(time: number): string {
    if (time < 10) {
      return `0${time}`;
    }

    return `${time}`;
  }

  /**
   * Starts the timer on a task.
   */
  startTimer(): void {
    if (!this.isActive) {
      if (!this.task.dateStarted) {
        this.task.dateStarted = new Date();
      }

      this.isActive = true;
      const dateStarted: Date = new Date();
      const timeAlreadyElapsed = this.task.time.seconds + this.task.time.minutes * 60 + this.task.time.hours * 3600;
      this.timer = window.setInterval(() => this.increaseTime(dateStarted, timeAlreadyElapsed), 1000);
      this.notifyService.announceTaskStarted(this.task.id);
      this.canBeStopped = true;
    }
  }

  /**
   * Pauses the timer.
   */
  pauseTimer(): void {
    if (this.isActive) {
      this.isActive = false;
      window.clearInterval(this.timer);
    }
  }


  /**
   * Stops the timer and moves a task to the archived list.
   */
  stopTimer(): void {
    this.pauseTimer();
    this.task.dateEnded = new Date();
    this.task.isCurrent = false;
    this.stopped.emit(this.task.id);
  }

  startBreakTimer(): void{
    if (!this.isActive) {
      if (!this.breaktask.dateStarted) {
        this.breaktask.dateStarted = new Date();
      }

      this.isActive = true;
      const dateStarted: Date = new Date();
      const timeAlreadyElapsed = this.breaktask.time.seconds + this.breaktask.time.minutes * 60 + this.breaktask.time.hours * 3600;
      this.timer = window.setInterval(() => this.increaseTime(dateStarted, timeAlreadyElapsed), 1000);
      this.notifyService.announceTaskStarted(this.breaktask.id);
      this.canBeStopped = true;
    }

  }
  stopBreakTimer():void{
    this.pauseTimer();
    this.breaktask.dateEnded = new Date();
    this.breaktask.isCurrent = false;
    this.stopped.emit(this.breaktask.id);
  }
  /**
   * Determines the difference in seconds between two dates.
   * @param dateStarted The initial date.
   * @param currentDate The end date.
   */
  private determineDifferenceInTime(dateStarted: any, currentDate: any) {
    return Math.floor(Math.abs(dateStarted - currentDate) / 1000);
  }

  /**
   * Increases the time.
   * @param dateStarted The date the timer was started.
   * @param timeAlreadyElapsed Any time already elapsed on the task.
   */
  private increaseTime(dateStarted: Date, timeAlreadyElapsed: number): void {
    let secondsElapsed = this.determineDifferenceInTime(dateStarted, new Date()) + timeAlreadyElapsed;
    this.task.time.hours = Math.floor(secondsElapsed / 3600);
    secondsElapsed %= 3600;
    this.task.time.minutes = Math.floor(secondsElapsed / 60);
    this.task.time.seconds = secondsElapsed % 60;
    this.setPrettyTime();
  }

  startRecordingTime() {
    this.action = 'start';
    this.projectService.startTimer({ taskId: this.task.id, action: this.action }).subscribe(timer => {
      this.startTimer();
    });

    this.servertimer = setInterval(() => {
      this.projectService.startTimer({ taskId: this.task.id, action: this.action }).subscribe(timer => {
      });
    }, 120000)
  }

  stopRecordingTime() {
    this.action = 'stop';
    stopCapture(this.videoElement);
    this.projectService.startTimer({ taskId: this.task.id, action: this.action }).subscribe(timer => {
      this.stopTimer();
      clearInterval(this.servertimer);
      clearInterval(this.captureTimer);
      this.dialog.close();
    });
  }

  startCaptureScreen(event: Event) {
    const displayMediaOptions = {
      cursor: 'always',
      displaySurface: 'monitor'
    };

    const callback = function () {
      this.stopRecordingTime();
      this.dialog.close();
    }.bind(this);

    startCapture(displayMediaOptions, callback).then(([stream, video]) => {
      this.videoElement = video;
      const tracks = stream.getVideoTracks();
      if (!!tracks && !!tracks.length) {
        const label = tracks[0].label;
        if (label.indexOf('screen:') < 0) {
          this.errorMessage = 'Entire screen must be shared to start timer';
          this.showErrorMessage();
        } else {
          this.startRecordingTime();
          this.startTakingSnapShot();
        }
      }
    }, error => {
      this.videoElement = null;
      this.errorMessage = 'Screen must be shared to start timer';
      this.showErrorMessage();
    })
  }

  startTakingSnapShot() {

    const takeSnapShot = () => {
      const dataUrl = captureSnapShot(this.videoElement);
      const file: File = this.dataURLtoFile(dataUrl, 'CaptureScreen.png');

      this.projectService.uploadScreenshot(this.data.id, file).subscribe((response) => {
      });
    }

    const randomNumber = Math.floor(Math.random() * 10);
    const timeout = randomNumber * 60 * 1000;
    console.log('Taking 1st screenshot in '+randomNumber+' min');
    
    setTimeout(function() {
      takeSnapShot();
      this.captureTimer = setInterval(() => {
        console.log('Interval snapshot');
        takeSnapShot();
      }, 600000);
    }.bind(this), timeout)

  }

  showErrorMessage() {
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 10000);
  }

  private dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
}
