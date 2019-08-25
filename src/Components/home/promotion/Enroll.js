import React, { Component } from 'react';
import Fade from 'react-reveal/Fade';
import FormField from '../../ui/formFields';
import { validate } from '../../../helpers';
import { firebasePromotions } from '../../../firebase';

class Enroll extends Component {

  state = {
    formError: false,
    formSuccess: '',
    formdata: {
      email: {
        element: 'input',
        value: '',
        config: {
          name: 'email_input',
          type: 'text',
          placeholder: 'Enter your email'
        },
        validation: {
          required: true,
          email: true
        },
        valid: false,
        validationMessage: ''
      }
    }
  }

  updateForm = (element) => {
    const newFormdata = this.state.formdata;
    const newElement = newFormdata[element.id];

    newElement.value = element.e.target.value;
    let validData = validate(newElement);
    newElement.valid = validData[0];
    newElement.validationMessage = validData[1];

    newFormdata[element.id] = newElement;

    this.setState({
      formError: false,
      formdata: newFormdata,
      formSuccess: ''
    });
  }

  resetFormSuccess() {
    const newFormdata = this.state.formdata;

    for(let key in newFormdata) {
      newFormdata[key].value = '';
      newFormdata[key].valid = false;
      newFormdata[key].validationMessage = '';
    }

    this.setState({
      formError: false,
      formdata: newFormdata,
      formSuccess: 'Congratulations'
    });

    this.successMessage();
  }

  successMessage() {
    setTimeout(() => {
      this.setState({
        formSuccess: ''
      });
    }, 3000);
  }

  onSubmit(e) {
    e.preventDefault();

    let dataToSubmit = {};
    let isValid = true;

    for(let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      isValid = this.state.formdata[key].valid && isValid;
    }

    if(isValid) {
      firebasePromotions.orderByChild('email').equalTo(dataToSubmit.email).once('value')
        .then((snapshot) => {
          if(snapshot.val() === null) {
            firebasePromotions.push(dataToSubmit);
            this.resetFormSuccess();
          } else {
            this.setState({
              formSuccess: 'Email already exists'
            });
          }
        })
    } else {
      this.setState({
        formError: true
      });
    }
  }

  render() {
    return (
      <Fade>
        <div className="enroll_wrapper">
          <form onSubmit={(e) => this.onSubmit(e)}>
            <div className="enroll_title">
              Enter you email
            </div>
            <div className="enroll_input">
              <FormField
                id={'email'}
                formdata={this.state.formdata.email}
                change={(element) => this.updateForm(element)}
              />
              {this.state.formError
                ? <div className="error_label">Please, try again</div>
                : null
              }
              <div className="success_label">{this.state.formSuccess}</div>
              <button type="submit">Enroll</button>
              <div className="enroll_discl">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi.
              </div>
            </div>
          </form>
        </div>
      </Fade>
    )
  }
}

export default Enroll;