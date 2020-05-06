<template>
  <div class="is-family-sans-serif" style="max-width: 600px; margin: 0 auto;">
    <div>
      <div class="symbol">
        <div class="symbol-cell">
          <div class="field has-addons">
            <p class="control">
              <a class="button is-static">
                <span style="font-weight: bold;">Player:</span>
              </a>
            </p>
            <div class="control">
              <div class="select">
                <select v-model="fields.player">
                  <option><span style="font-weight: bold;">X</span></option>
                  <option
                    ><span style="font3273dc-weight: bold;">O</span></option
                  >
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="symbol-cell">
          <div class="buttons has-addons is-centered">
            <button class="button is-static">
              <span class="has-text-weight-bold">Computer:</span>
            </button>
            <button class="button is-static">
              <span class="has-text-weight-bold">{{ computer }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="box">
      <div
        class="has-text-centered is-size-7"
        style="padding-bottom: 1em;"
        v-show="playerTurn"
      >
        <span class="" style="color: #631D76;">Your turn</span>
      </div>
      <div class="board">
        <div class="one cell" v-on:click="move('one', fields.player)">
          <div class="is-size-1">{{ board.one }}</div>
        </div>
        <div class="two cell" v-on:click="move('two', fields.player)">
          <div class="is-size-1">{{ board.two }}</div>
        </div>
        <div class="three cell" v-on:click="move('three', fields.player)">
          <div class="is-size-1">{{ board.three }}</div>
        </div>
        <div class="four cell" v-on:click="move('four', fields.player)">
          <div class="is-size-1">{{ board.four }}</div>
        </div>
        <div class="five cell" v-on:click="move('five', fields.player)">
          <div class="is-size-1">{{ board.five }}</div>
        </div>
        <div class="six cell" v-on:click="move('six', fields.player)">
          <div class="is-size-1">{{ board.six }}</div>
        </div>
        <div class="seven cell" v-on:click="move('seven', fields.player)">
          <div class="is-size-1">{{ board.seven }}</div>
        </div>
        <div class="eight cell" v-on:click="move('eight', fields.player)">
          <div class="is-size-1">{{ board.eight }}</div>
        </div>
        <div class="nine cell" v-on:click="move('nine', fields.player)">
          <div class="is-size-1">{{ board.nine }}</div>
        </div>
      </div>
    </div>
    <div class="">
      <p class="title" style="color: #631D76;">Score</p>
      <div class="buttons has-addons is-centered">
        <button class="button is-static">
          <span class="has-text-weight-bold">{{ playerScore }}</span>
        </button>
        <button class="button is-static">
          <span class="has-text-weight-bold">{{ computerScore }}</span>
        </button>
      </div>
      <button
        class="button is-centered"
        style="background-color: #631D76; color: white;"
      >
        <span class="has-text-weight-bold" v-on:click="reset">Reset</span>
      </button>
    </div>
  </div>
</template>

<script>
const minmaxWorker = new Worker("./minmax.js", { type: "module" });

export default {
  name: "Board",
  mounted() {
    const move_fn = this.move;
    const symbol = this.computer;
    const gameover_fn = this.gameover;
    minmaxWorker.onmessage = function(event) {
      console.log(event.data);
      const { cmd, data } = event.data;
      switch (cmd) {
        case "move":
          move_fn(data, symbol);
          break;
        case "gameover":
          gameover_fn(data);
          break;
      }
    };
  },
  data() {
    return {
      fields: {
        player: "X",
      },
      playerScore: 0,
      computerScore: 0,
      board: {
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
      },
      turn: "player",
      isGameover: false,
    };
  },
  methods: {
    move(cell, symbol) {
      if (this.validate(cell)) {
        this.board[cell] = symbol;
        this.next();
      }
    },
    validate(cell) {
      return !this.isGameover && this.board[cell] == null;
    },
    cell(index) {
      return this.board[index];
    },
    computerCharacter() {
      switch (this.fields.player) {
        case "O":
          return "X";
        default:
          return "O";
      }
    },
    reset() {
      this.board = {
        one: null,
        two: null,
        three: null,
        four: null,
        five: null,
        six: null,
        seven: null,
        eight: null,
        nine: null,
      };
    },
    next() {
      switch (this.turn) {
        case "player":
          this.turn = "computer";
          this.computerMove();
          break;
        case "computer":
          this.turn = "player";
          break;
      }
    },
    computerMove() {
      let board = [
        this.board["one"],
        this.board["two"],
        this.board["three"],
        this.board["four"],
        this.board["five"],
        this.board["six"],
        this.board["seven"],
        this.board["eight"],
        this.board["nine"],
      ];
      let symbol = this.computer;
      //console.log("player", this.fields.player);
      let opponentSymbol = this.fields.player;
      minmaxWorker.postMessage({ board, symbol, opponentSymbol });
    },
    gameover() {
      this.isGameover = true;
      //console.log(data);
    },
  },
  computed: {
    computer() {
      return this.computerCharacter();
    },
    playerTurn() {
      return this.turn === "player";
    },
  },
};
</script>

<style lang="css" scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.15em;
  grid-template-rows: repeat(3, 100px);
}

.cell {
  background-color: #e6e8e6;
  color: #631d76;
  text-align: center;
  padding-top: 1em;
  padding-bottom: 1em;
  user-select: none;
}

.symbol {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.15em;
  padding: 1em;
}

.select:not(.is-multiple):not(.is-loading)::after {
  border-color: #631d76;
}
</style>
