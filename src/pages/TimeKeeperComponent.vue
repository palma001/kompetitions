<template>
  <q-page class="bg-blue-grey-1">
    <div class="row q-pa-xl justify-center" style=" height: 810px">
      <div class="col-md-12 col-lg-11 q-pb-lg q-mt-lg bg-white">
        <!-- title - Team name -->
        <div class="row q-pa-md q-pb-xl justify-around">
          <div class="col-5">
            <q-toolbar-title class="text-h4 text-white text-center bg-primary">
              {{
                translateLabel('timekeeperEntity', 'teamA')
              }}
              {{
                (confrontationPlaying['TeamA']) ? confrontationPlaying['TeamA']['name'].toUpperCase() : ''
              }}
            </q-toolbar-title>
          </div>
          <div class="col-5">
            <q-toolbar-title class="text-h4 text-white text-center bg-primary">
              {{
                translateLabel('timekeeperEntity', 'teamB')
              }}
              {{
                (confrontationPlaying['TeamB']) ? confrontationPlaying['TeamB']['name'].toUpperCase() : ''
              }}
            </q-toolbar-title>
          </div>
        </div>
        <!-- time -->
        <div class="row q-pa-md justify-center">
          <div class="col-12">
            <q-toolbar-title class="q-mt-xl text-h3 text-center text-primary text-bold">
              {{
                translateComponent('time')
              }}
            </q-toolbar-title>
          </div>
        </div>
        <!-- Toolbar time -->
        <q-toolbar>
          <q-space></q-space>
          <q-btn class="q-px-xl q-py-xs"
            style="font-size: 35px"
            align="center"
            color="positive"
            label="Start"
            push
            @click="startTimer"/>
          <q-space></q-space>
          <q-btn size="35px"
            class="q-px-xl q-py-xs"
            align="center"
            outline
            disable
            push>
              {{
                (10 > minutesRound) ?  `0${minutesRound}` : minutesRound
              }} :
              {{
                (10 > secondsRound) ?  `0${secondsRound}` : secondsRound
              }}
          </q-btn>
          <q-space></q-space>
          <q-btn class="q-px-xl q-py-xs"
            style="font-size: 35px"
            align="center"
            color="info"
            label="Stop"
            push
            @click="stopTimer"/>
          <q-space></q-space>
        </q-toolbar>
        <!-- time adicional -->
        <div class="row q-pa-md justify-center">
          <div class="col-12">
            <q-toolbar-title class="q-mt-xl text-h3 text-center text-primary text-bold">
              {{
                translateComponent('time')
              }}
            </q-toolbar-title>
          </div>
        </div>
        <!-- Toolbar time adicional -->
        <q-toolbar>
          <q-space></q-space>
          <q-btn class="q-px-xl q-py-xs"
            style="font-size: 30px;"
            align="center"
            color="accent"
            label="restart"
            push
            @click="restartQuestion" />
          <q-space></q-space>
          <q-btn size="35px"
            class="q-px-xl q-py-xs q-ml-md q-mr-lg"
            style="width: 150px;"
            align="center"
            outline
            disable
            push
            :label="secondsQuestion"/>
          <q-space></q-space>
          <q-btn class="q-px-xl q-py-xs"
            style="font-size: 30px"
            align="center"
            color="accent"
            label="Start"
            push
            @click="startQuestion"/>
          <q-space></q-space>
        </q-toolbar>
        <div class="row justify-end q-mr-xl">
          <div class="col-auto q-mt-xl">
            <q-btn color="positive"
              style="font-size: 25px"
              label="Finish"
              push
              @click="finishConfrontation" />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'TimeKeeper',
  data () {
    return {
      /**
       * minutes confrontation
       * @type {Number}
       */
      minutesRound: 10,
      /**
       * secons confrontation
       * @type {Number}
       */
      secondsRound: 0,
      /**
       * secons question
       * @type {Number}
       */
      secondsQuestion: 5,
      /**
       * id interval
       * @type {Number}
       */
      setInterval: null,
      /**
       * Status timer
       * @type {Boolean}
       */
      stop: false,
      /**
       * status temporizator
       * @type {Boolean}
       */
      stopQuestion: false,
      /**
       * id interval question
       * @type {Number}
       */
      setIntervalQuestion: null,
      /**
       * Data confrontations playing
       * @type {Object}
       */
      confrontationPlaying: {},
      /**
       * Point teams
       * @type {Object}
       */
      points: {},
      /**
       * questions
       * @type {Object}
       */
      question: {},
      /**
       * Status semifinal
       * @type {Boolean}
       */
      semifinal: false
    }
  },
  computed: {
    ...mapGetters(['confrontations/confrontationsdGetter'])
  },
  sockets: {
    /**
     * Time confronation
     * @param  {Object} time confrontations
     */
    time (time) {
      this.secondsRound = time.secondsRound
      this.minutesRound = time.minutesRound
    },
    /**
     * sets confrontation playing
     * @param  {Array} confrontation
     */
    confrontationsPlaying (confrontation) {
      this.confrontationPlaying = confrontation[0]
    },
    /**
     * Point teams
     * @param  {Object} point teams
     */
    pointsTeams (point) {
      this.points = point
    },
    /**
     * Capture event the socket
     * @param  {Array} question question
     */
    getQuestions (question) {
      this.question = question
      this.secondsQuestion = (question.typeQuestion === 'bonus') ? 15 : 5
      this.restartQuestion()
    }
  },
  methods: {
    /**
     * Temporizator
     */
    updateCounter () {
      this.secondsRound -= 1
      if (this.secondsRound <= 0 && this.minutesRound !== 0) {
        this.minutesRound -= 1
        this.secondsRound = 59
      }
      if (this.minutesRound === 0 && this.secondsRound < 0) {
        this.minutesRound = 10
        this.secondsRound = 0
        this.stopTimer()
      }
      this.reloadTemporizator()
    },
    /**
     * Reload temporizator
     */
    reloadTemporizator () {
      this.$socket.emit('temporizator', {
        secondsRound: this.secondsRound,
        minutesRound: this.minutesRound
      })
    },
    /**
     * Stop Temporizator
     */
    stopTimer () {
      if (this.stop) {
        this.stop = false
        clearInterval(this.setInterval)
      }
    },
    /**
     * Finish confrontations
     */
    finishConfrontation () {
      let data = {
        timeStop: this.dateFormat(Date()),
        status: (this.confrontationPlaying.status !== 'DEFINITION') ? 'played' : 'definition_played'
      }
      if (this.points['teamA'] === this.points['teamB']) {
        this.messageNotify('report_problem', 'negative', 'center', 'no puede quedar empatados')
      } else {
        this.$socket.emit('statusButton', true)
        this.minutesRound = 10
        this.secondsRound = 0
        this.updateConfrontations(data)
        this.nextPhase(this.confrontationPlaying)
        this.stopTimer()
        this.reloadTemporizator()
        setTimeout(() => {
          this.$socket.emit('reloadPoint')
        }, 200)
      }
    },
    /**
     * Sets nex phase
     * @param  {Number} team  team id
     * @param  {Number} phase phase id
     */
    async getConfrontationsNextPhase (team, phase) {
      let { response } = await this.$services.getData(['phase', 0, 'confrontation'])
      if (this.confrontationPlaying.status !== 'DEFINITION') {
        if (response['data'] && response['data'].length > 0) {
          let newTeam = response['data'].filter(function (element) {
            return element['teamB'] === null
          })
          if (newTeam.length <= 0) {
            if (this.confrontationPlaying.semifinale) {
              await this.addConfrontations(team.loser, phase)
              await this.addConfrontations(team.winner, phase + 2)
            } else {
              await this.addConfrontations(team.winner, phase)
            }
          } else {
            if (this.confrontationPlaying.semifinale) {
              await this.updateConfrontationsWinner(team.winner, phase + 2, newTeam[1].id)
              await this.updateConfrontationsWinner(team.loser, phase, newTeam[0].id)
            } else {
              let res = await this.updateConfrontationsWinner(team.winner, phase, newTeam[0].id)
              if (!res.status) {
                await this.addConfrontations(team.winner, phase)
                await this.$services.deleteData(['events', this.confrontationPlaying.eventId])
                await this.$services.patchData(['questions', 1])
              }
            }
          }
        } else {
          if (this.confrontationPlaying.semifinale) {
            await this.addConfrontations(team.loser, phase)
            await this.addConfrontations(team.winner, phase + 2)
          } else {
            await this.addConfrontations(team.winner, phase)
          }
        }
      }
    },
    /**
     * Add confrontations
     * @param {Number} team  number team
     * @param {Number} phase number phase
     */
    async addConfrontations (team, phase) {
      let data = {
        phaseId: phase,
        teamA: team,
        teamB: null,
        status: 'TOPLAY',
        created_by: 'luis',
        updated_by: 'luis'
      }
      await this.$services.postData(['phase', phase, 'confrontation'], data)
    },
    /**
     * Update semifinal
     * @param  {Number} phase Number
     */
    async getSemifinal (phase) {
      let { response } = await this.$services.getData(['phase', 0, 'confrontation'], {
        status: 'TOPLAY'
      })
      let resp = await this.$services.getData(['phase', 0, 'confrontation'], {
        semifinale: true
      })
      if (response['data'].length === 2 && resp['response']['data'].length <= 1) {
        let res = await this.$services.getData(['phase', phase, 'confrontation'])
        res.response.data.map(async (element) => {
          await this.$services.putData(['phase', phase, 'confrontation', element.id], { semifinale: true, phaseId: 3 })
        })
      }
    },
    /**
     * Update confrontations winner
     * @param  {Number} team
     * @param  {Number} phase
     * @param  {Number} newTeam
     */
    async updateConfrontationsWinner (team, phase, newTeam) {
      let res = await this.$services.putData(
        [
          'phase',
          phase,
          'confrontation',
          newTeam
        ],
        {
          phaseId: phase,
          teamB: team,
          status: 'TOPLAY'
        }
      )
      return res
    },
    /**
     * Next phase
     * @param  {Object} data
     */
    async nextPhase (data) {
      let team = {}
      if (this.points['teamA'] > this.points['teamB']) {
        team = {
          winner: data['teamA'],
          loser: data['teamB']
        }
      } else {
        team = {
          winner: data['teamB'],
          loser: data['teamA']
        }
      }
      data.phaseId += 1
      this.getConfrontationsNextPhase(team, data.phaseId)
      setTimeout(() => {
        this.getSemifinal(data.phaseId)
      }, 200)
    },
    /**
     * Start Temporizator
     */
    startTimer () {
      if (!this.stop) {
        this.stop = true
        this.setInterval = setInterval(this.updateCounter, 1000)
        this.$socket.emit('statusButton', false)
        this.$socket.emit('reloadPoint')
        if (this.minutesRound === 10 && !this.confrontationPlaying.timeStart) {
          let data = {
            timeStart: this.dateFormat(Date())
          }
          this.updateConfrontations(data)
        }
      }
    },
    /**
     * Update status confrontations
     * @param  {object} data
     */
    async updateConfrontations (data) {
      await this.$services.putData(['phase', this.confrontationPlaying['phaseId'], 'confrontation', this.confrontationPlaying['id']], data)
      this.$socket.emit('refreshConfrontations')
    },
    /**
     * Date Format
     * @param {String} date formating
     */
    dateFormat (date) {
      if (date) {
        date = new Date(date)
        date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
      } else {
        date = ''
      }
      return date
    },
    /**
     * Tempirizator question
     */
    updateQuestion () {
      this.secondsQuestion -= 1
      if (this.secondsQuestion <= 0) {
        this.restartQuestion()
      }
      this.$socket.emit('temporizatorQuestion', this.secondsQuestion)
    },
    /**
     * Start question
     */
    startQuestion () {
      if (!this.stopQuestion) {
        this.stopQuestion = true
        this.setIntervalQuestion = setInterval(this.updateQuestion, 1000)
      }
    },
    /**
     * restart question
     */
    restartQuestion () {
      if (this.stopQuestion) {
        this.stopQuestion = false
        clearInterval(this.setIntervalQuestion)
        this.$socket.emit('getQuestion', this.question)
      }
    },
    /**
     * Translates the tags in template
     * @param {String} message tag to translate
     */
    translateComponent (message) {
      return this.$i18n.t(`template.${message}.label`)
    },
    /**
     * Message notify
     * @param  {String} icon     icon notify
     * @param  {String} color    color notify
     * @param  {String} position postions notify
     * @param  {String} message  message notify
     */
    messageNotify (icon, color, position, message) {
      this.$q.notify({
        position: position,
        color: color,
        icon: icon,
        message: message
      })
    },
    /**
     * Translates the tags in template
     * @param {String} message tag to translate
     */
    translateLabel (entity, message) {
      return this.$i18n.t(`template.${entity}.${message}.label`)
    },
    ...mapActions(
      [
        'confrontations/getConfrontations',
        'confrontations/addStartTime'
      ]
    )
  }
}
</script>

<style>
.title {
  background-color: white;
  padding: 20px;
  margin-inline-start: 10px;
}
.buttonQ {
  margin-inline-start: 40px;
}
.score {
  margin-inline-start: 330px;
  margin-top: 50px;
}
.title1 {
  margin-top: 1000px;
}
.buttonF {
  margin-inline-start: 10px;
}
.buttonG {
  margin-inline-start: 10px;
}
</style>
