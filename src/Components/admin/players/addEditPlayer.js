import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';
import FormField from '../../ui/formFields';
import { validate } from '../../../helpers';
import { firebase, firebaseDB, firebasePlayers } from '../../../firebase';
import Fileuploader from '../../ui/fileuploader';

const TYPE_ADD_PLAYER = 'Add Player';
const TYPE_EDIT_PLAYER = 'Edit Player';

class AddEditPlayer extends Component {

  state = {
    buttonDisabled: true,
    playerId: '',
    defaultImg: '',
    playerImgName: '',
    formType: '',
    formSuccess: '',
    formError: '',
    formdata: {
      name: {
        element: 'input',
        value: '',
        config: {
          name: 'name_input',
          title: 'Player name',
          type: 'text',
          placeholder: ''
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      lastname: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname_input',
          title: 'Player last name',
          type: 'text',
          placeholder: ''
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      number: {
        element: 'input',
        value: '',
        config: {
          name: 'lastname_input',
          title: 'Player number',
          type: 'text',
          placeholder: ''
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      position: {
        element: 'select',
        value: '',
        config: {
          name: 'select_position',
          title: 'Player position',
          type: 'select',
          options: [
            {key: 'Goalkeeper', value: 'Goalkeeper'},
            {key: 'Defence', value: 'Defence'},
            {key: 'Midfield', value: 'Midfield'},
            {key: 'Striker', value: 'Striker'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      image: {
        element: 'image',
        value: '',
        validation: {
          required: true
        },
        valid: false
      }
    }
  }

  componentDidMount() {
    const playerId = this.props.match.params.id;

    if(!playerId) {
      this.setState({
        formType: TYPE_ADD_PLAYER,
        buttonDisabled: false
      });
    } else {
      firebaseDB.ref(`players/${playerId}`).once('value')
        .then(snapshot => {
          const playerData = snapshot.val();

          const newFormdata = {...this.state.formdata};
          for(let key in newFormdata) {
            newFormdata[key].value = playerData[key];
            newFormdata[key].valid = true;
          }

          firebase.storage().ref('players').child(playerData.image).getDownloadURL()
            .then(url => {
              newFormdata['image'].value = url;
              this.setState({
                defaultImg: url,
                playerImgName: playerData.image
              });
            })
            .catch(e => {
              this.setState({
                defaultImg: ''
              });
            })
          
          this.setState({
            formType: TYPE_EDIT_PLAYER,
            playerId,
            formdata: newFormdata,
            buttonDisabled: false
          });
        });
    }
  }

  updateForm = (element, content = '') => {
    const newFormdata = this.state.formdata;
    const newElement = newFormdata[element.id];

    if(content === '') {
      newElement.value = element.e.target.value;
    } else {
      newElement.value = content;
    }

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

  successMessage(message) {
    this.setState({ formSuccess: message });

    setTimeout(() => {
      this.setState({ formSuccess: '' });
    }, 2000);
  }

  submitForm(event) {
    event.preventDefault();

    let dataToSubmit = {};
    let fromIsValid = true;

    for(let key in this.state.formdata) {
      dataToSubmit[key] = this.state.formdata[key].value;
      fromIsValid = this.state.formdata[key].valid && fromIsValid;
    }

    if(fromIsValid) {
      if(this.state.formType === TYPE_EDIT_PLAYER) {
        firebaseDB.ref(`players/${this.state.playerId}`).update(dataToSubmit)
          .then(() => {
            this.successMessage('Player edited successfully')
          })
          .catch(e => {
            this.setState({
              formError: true
            });
          })
      } else {
        firebasePlayers.push(dataToSubmit)
          .then(() => {
            this.props.history.push('/admin/players');
          })
          .catch(e => {
            this.setState({
              formError: true
            });
          })
      }
    } else {
      this.setState({ formError: true })
    }
  }

  resetImage = () => {
    const newFormdata = {...this.state.formdata};
    newFormdata['image'].value = '';
    newFormdata['image'].valid = false;
    
    this.setState({
      defaultImg: '',
      formdata: newFormdata
    });
  }

  storeFilename = (filename) => {
    this.updateForm({id: 'image'}, filename);
  }

  render() {
    const { buttonDisabled } = this.state;

    return (
      <AdminLayout>
        <div className="editplayers_dialog_wrapper">
          <h2>{ this.state.formType }</h2>
          <form onSubmit={(event) => this.submitForm(event)}>
            <Fileuploader
              dir="players"
              tag="Player image"
              defaultImg={this.state.defaultImg}
              defaultImgName={this.state.formdata.image.value}
              playerImgName={this.state.formdata.image.value}
              resetImage={() => this.resetImage()}
              filename={(filename) => this.storeFilename(filename)}
            />
            <FormField
              id={'name'}
              formdata={this.state.formdata.name}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={'lastname'}
              formdata={this.state.formdata.lastname}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={'number'}
              formdata={this.state.formdata.number}
              change={(element) => this.updateForm(element)}
            />
            <FormField
              id={'position'}
              formdata={this.state.formdata.position}
              change={(element) => this.updateForm(element)}
            />
            <div className="success_label">{ this.state.formSuccess }</div>
            {this.state.formError &&
              <div className="error_label">Something is wrong</div>
            }
            <div className="admin_submit">
              {
                buttonDisabled ?
                  <button type="submit" onClick={(event) => this.submitForm(event)} disabled>
                    { this.state.formType }
                  </button>
                :
                  <button type="submit" onClick={(event) => this.submitForm(event)}>
                    { this.state.formType }
                  </button>
              }
            </div>
          </form>
        </div>
      </AdminLayout>
    )
  }
}

export default AddEditPlayer;