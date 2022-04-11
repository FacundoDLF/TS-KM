/*eslint no-restricted-imports: ["error", "intro"]*/
// import introJs from "intro.js";
// import { IntroStep } from "@/constants/introSteps";

// export class Intro {
//   private static instance: Intro;
//   // eslint-disable-next-line
//   private intro: any;
//   private forceQuit = false;

//   public static getInstance(): Intro {
//     if (!this.instance) this.instance = new Intro();
//     return this.instance;
//   }

//   public initialize(introSteps: IntroStep[]) {
//     if (this.intro) return;
//     this.intro = introJs();
//     this.forceQuit = false;
//     this.intro.setOptions({
//       steps: introSteps,
//       showProgress: true,
//       showBullets: false,
//       disableInteraction: true,
//       hidePrev: true,
//       exitOnOverlayClick: false,
//       prevLabel: "BACK",
//       nextLabel: "NEXT",
//       doneLabel: "DONE"
//     });
//     this.intro.onbeforeexit(() => {
//       if (
//         this.intro.currentStep() === introSteps.length - 1 ||
//         this.forceQuit
//       ) {
//         this.intro = null;
//         return true;
//       }
//       const result = confirm("Are you sure you want to skip the introduction?");
//       if (result) this.intro = null;
//       return result;
//     });
//   }

//   public start() {
//     if (!this.intro) return;
//     this.intro.start();
//   }

//   public stop() {
//     this.forceQuit = true;
//     this.intro && this.intro.exit();
//     this.intro = null;
//   }
// }
