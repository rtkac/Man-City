import React, { Component } from 'react';
import AdminLayout from '../../../Hoc/AdminLayout';
import FormField from '../../ui/formFields';
import { validate, firebaseLooper } from '../../../helpers';
import { firebaseDB, firebaseTeams, firebaseMatches } from '../../../firebase';

const TYPE_ADD_MATCH = 'Add Match';
const TYPE_EDIT_MATCH = 'Edit Match';

class addEditMatch extends Component {
  
  state = {
    buttonDisabled: true,
    formType: '',
    formSuccess: '',
    formError: '',
    formdata: {
      date: {
        element: 'input',
        value: '',
        config: {
          name: 'date_input',
          title: 'Event date',
          type: 'date',
          placeholder: ''
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      local: {
        element: 'select',
        value: '',
        config: {
          name: 'select_local',
          type: 'select',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      resultLocal: {
        element: 'input',
        value: '',
        config: {
          name: 'result_local_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      away: {
        element: 'select',
        value: '',
        config: {
          name: 'select_away',
          type: 'select',
          options: []
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      resultAway: {
        element: 'input',
        value: '',
        config: {
          name: 'result_away_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      referee: {
        element: 'input',
        value: '',
        config: {
          title: 'Referee',
          name: 'referee_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      stadium: {
        element: 'input',
        value: '',
        config: {
          title: 'Stadium',
          name: 'stadium_input',
          type: 'text'
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      result: {
        element: 'select',
        value: '',
        config: {
          title: 'Team result',
          name: 'select_result',
          type: 'select',
          options: [
            {key: 'W', value: 'W'},
            {key: 'L', value: 'L'},
            {key: 'D', value: 'D'},
            {key: 'n/a', value: 'n/a'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      },
      final: {
        element: 'select',
        value: '',
        config: {
          title: 'Game played?',
          name: 'select_final',
          type: 'select',
          options: [
            {key: 'Yes', value: 'Yes'},
            {key: 'No', value: 'No'}
          ]
        },
        validation: {
          required: true
        },
        valid: false,
        validationMessage: ''
      }
    }
  }


  componentDidMount() {
    const matchId = this.props.match.params.id;

    const getTeams = (match, type) => {
      firebaseTeams.once('value')
        .then(snapshot => {
          const teams = firebaseLooper(snapshot);
          const teamOptions = [];
  
          snapshot.forEach(childSnapshot => {
            teamOptions.push({
              key: childSnapshot.val().shortName,
              value: childSnapshot.val().shortName
            });
          });
  
          this.updateFields(match, teamOptions, teams, type, matchId);
        });
    }

    if(!matchId) {
      this.setState({
        buttonDisabled: false
      });
      getTeams(false, TYPE_ADD_MATCH);
    } else {
      firebaseDB.ref('matches').once('value')
        .then((snapshot) => {
          this.setState({
            buttonDisabled: false
          });
          const match = snapshot.child(matchId).val();
          getTeams(match, TYPE_EDIT_MATCH);
        });
    }
  }


  updateFields(match, teamOptions, teams, type, matchId) {
    firebaseDB.ref('matches').once('value')
      .then((snapshot) => {
        const match = snapshot.child(matchId).val();

        const newFormdata = {...this.state.formdata};

        for(let key in newFormdata) {
          if(match) {
            newFormdata[key].value = match[key];
            newFormdata[key].valid = true;
          }
          
          if(key === 'local' || key === 'away') {
            newFormdata[key].config.options = teamOptions;
          }
        }

        this.setState({
          matchId,
          formType: type,
          formdata: newFormdata,
          teams
        });

      });
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

    if(this.state.teams) {
      this.state.teams.forEach(team => {
        if(team.shortName === dataToSubmit.local) {
          dataToSubmit['localThmb'] = team.thmb
        }
        if(team.shortName === dataToSubmit.away) {
          dataToSubmit['awayThmb'] = team.thmb
        }
      })
    }
    
    if(fromIsValid) {
      if(this.state.formType === TYPE_EDIT_MATCH) {
        firebaseDB.ref(`matches/${this.state.matchId}`).update(dataToSubmit)
          .then(() => {
            this.successMessage('Match edited successfully');
          })
          .catch((e) => {
            this.setState({ formError: true })
          })
      } else {
        firebaseMatches.push(dataToSubmit)
          .then(() => {
            this.successMessage('Match added successfully');
            this.props.history.push('/admin/matches');
          })
          .catch(e => {
            this.setState({ formError: true })
          })
      }
    } else {
      this.setState({ formError: true })
    }

  }

  render() {
    const { buttonDisabled } = this.state;
    return (
      <AdminLayout>
        <div className="editmatch_dialog_wrapper">
          <h2>{ this.state.formType }</h2>
          <div>
            <form onSubmit={(event) => this.submitForm(event)}>
              <FormField
                id={'date'}
                formdata={this.state.formdata.date}
                change={(element) => this.updateForm(element)}
              />
              <div className="select_team_layout">
                <div className="label_inputs">Local</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={'local'}
                      formdata={this.state.formdata.local}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormField
                      id={'resultLocal'}
                      formdata={this.state.formdata.resultLocal}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>
              <div className="select_team_layout">
                <div className="label_inputs">Away</div>
                <div className="wrapper">
                  <div className="left">
                    <FormField
                      id={'away'}
                      formdata={this.state.formdata.away}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                  <div>
                    <FormField
                      id={'resultAway'}
                      formdata={this.state.formdata.resultAway}
                      change={(element) => this.updateForm(element)}
                    />
                  </div>
                </div>
              </div>
              <div className="split_fields">
                <FormField
                  id={'referee'}
                  formdata={this.state.formdata.referee}
                  change={(element) => this.updateForm(element)}
                />
                <FormField
                  id={'stadium'}
                  formdata={this.state.formdata.stadium}
                  change={(element) => this.updateForm(element)}
                />
              </div>
              <div className="split_fields">
                <FormField
                  id={'result'}
                  formdata={this.state.formdata.result}
                  change={(element) => this.updateForm(element)}
                />
                <FormField
                  id={'final'}
                  formdata={this.state.formdata.final}
                  change={(element) => this.updateForm(element)}
                />
              </div>
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
        </div>
      </AdminLayout>
    )
  }
}

export default addEditMatch;