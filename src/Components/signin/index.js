import React, { Component } from 'react';
import FormField from '../ui/formFields';
import { validate } from '../../helpers';
import { firebase } from '../../firebase';

class SignIn extends Component {

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
      },
      password: {
        element: 'input',
        value: '',
        config: {
          name: 'password_input',
          type: 'password',
          placeholder: 'Enter your password'
        },
        validation: {
          required: true
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

  onSubmit(e) {
    e.preventDefault();

    let dataToSubmit = {};
    let isValid = true;

    for(let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      isValid = this.state.formdata[key].valid && isValid;
    }

    if(isValid) {
      firebase.auth()
        .signInWithEmailAndPassword(
          dataToSubmit.email,
          dataToSubmit.password
        )
          .then(() => {
            console.log('som tuuu')
            this.props.history.push('/admin')
          })
          .catch(error => {
            this.setState({
              formError: true
            });
          });
    } else {
      this.setState({
        formError: true
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="signin_wrapper" style={{margin: '100px'}}>
          <form onSubmit={(e) => this.onSubmit(e)}>
            <h2>Sign in</h2>
            <FormField
              id={'email'}
              formdata={this.state.formdata.email}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={'password'}
              formdata={this.state.formdata.password}
              change={(element) => this.updateForm(element)}
            />
            {this.state.formError
              ? <div className="error_label">Wrong email or password</div>
              : null
            }
            <button type="submit">Sign in</button>
          </form>
        </div>
      </div>
    )
  }
}

export default SignIn;