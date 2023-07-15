import { LightningElement, api, wire } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import CONFETTI from '@salesforce/resourceUrl/Confetti';
import { getRecord, updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import CASE_OBJECT from '@salesforce/schema/Case';
import STATUS_FIELD from '@salesforce/schema/Case.Status';

export default class CaseConfetti extends NavigationMixin(LightningElement) {
  @api recordId;
  showConfetti = false;
  confettiInitialized = false;

  handleSave() {
    const form = this.template.querySelector('lightning-record-edit-form');
    form.submit();
  }

  handleSuccess() {
    this.showSuccessMessage();
    this.showConfetti = true;

    // Initialize and start the confetti animation
    if (!this.confettiInitialized) {
      this.setUpCanvas();
      this.basicCannon();
      this.confettiInitialized = true;
    }

    // Navigate to the record page
    this.navigateToRecordPage();
  }

  showSuccessMessage() {
    const toastEvent = new ShowToastEvent({
      title: 'Success',
      message: 'Case Closed successfully!',
      variant: 'success',
    });
    this.dispatchEvent(toastEvent);
  }

  navigateToRecordPage() {
    this[NavigationMixin.Navigate]({
      type: 'standard__recordPage',
      attributes: {
        recordId: this.recordId,
        objectApiName: CASE_OBJECT.objectApiName,
        actionName: 'view',
      },
    });
  }
  handleCancel(event){
      var url =window.location.href;
      var value = url.substr(0,url.lastIndexOf('/')+1);
      window.history.back();
      return false;
  }
  connectedCallback() {
    // Load the confetti library
    loadScript(this, CONFETTI)
      .then(() => {
        console.log('Confetti library loaded');
      })
      .catch((error) => {
        console.error('Error loading confetti library:', error);
      });
  }

  setUpCanvas() {
    const confettiCanvas = this.template.querySelector('canvas.confettiCanvas');
    this.myconfetti = confetti.create(confettiCanvas, { resize: true });
    this.myconfetti({
      zIndex: 10000,
    });
  }

  basicCannon() {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {
        y: 0.6,
      },
    });
  }
}
