<template>
  <!-- div for placing Bar chart and Data-->
  <div>
    <AttendingBar v-if="!othererror && !error" :label="mychartlabels" :chart-data="mychartData"></AttendingBar>
  </div>
 <!-- TABLE ----------------------------------------------------->
 
  <div>
    <table class='table1'>
      <thead>

        <tr>
          <th  scope="col" style="text-align: left; width: 10rem;"> Event </th>
          <th  scope="col" style="text-align: left; width: 10rem;"> Number of Attendees</th>
        
        </tr>
      </thead>
      <tbody>
        <!-- FOR loop for inserting data within table-->
        <tr v-for="data in alleventdata" v-bind:key="data.id">
          <td style="text-align: left; width: 10rem;"> {{ data.eventName }}</td>
          <td style="text-align: left; width: 10rem;"> {{data.attendees.length}}</td>
        </tr>

      </tbody>

    </table>

  </div>

  
</template>
<script>
// Import necessary things
import AttendingBar from '../assets/barChart.vue';
import axios from "axios";
export default {
  components: {
    AttendingBar,
  },
  // Create Arrays where JSON pulled from our API will be stored
  data() {
    return {
      mychartlabels: [],
      mychartData: [],
      attendeeID: [],
      myeventName: [],
      alleventdata: [],
      othererror: false,
      error: null,
    }
  },
  // using FETCH inorder to pull from our API 
  methods: {
    async fetchData() {
      try {
        this.error = null;
        this.othererror = true;
        const url = 'http://localhost:3000/eventData/pasttwo';
        const response = await axios.get(url);
        //"re-organizing" - mapping json from the response
        this.mychartlabels = response.data.map((item) => item.eventName);
        this.mychartData = response.data.map((item) => item.attendees.length);
        this.attendeeID = response.data.map((item) => item.attendees);
        this.myeventName = response.data.map((item) => item.eventName);
        this.alleventdata = response.data;
      } catch (err) {
        // IF statemsnt for specific types of errrors and output
        if (err.response) {
          // Response Error
          this.error = {
            title: "Server Response",
            message: err.message,
          };
        } else if (err.request) {
          // Request Error
          this.error = {
            title: "Unable to Reach Server",
            message: err.message,
          };
        } else {
          // Code Error
          this.error = {
            title: "Application Error",
            message: err.message,
          };
        }
      }
      this.othererror = false;
    },
  },
  mounted() {
    this.fetchData();
  },
};

</script>



