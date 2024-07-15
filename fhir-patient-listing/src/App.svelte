<script lang="ts">
  import { Router, Link, Route } from "svelte-routing";
  import PatientList from "./PatientList.svelte";
    import PatientForm from "./PatientForm.svelte";
</script>

<Router>
  <main>
    <div class="bg-base-layer h-screen w-screen relative">
      <div
        class="absolute left-red-rect-right top-red-rect-top w-sidebar h-red-rectangle bg-accent-red rounded-2xl ml-6 mt-5"
      ></div>
      <div
        class="absolute left-main-right top-main-top w-main-content h-main-screen bg-main-bg rounded-3xl shadow-lg flex overflow-hidden ml-14 mt-10"
      >
        <div class="max-w mx-10 my-10">
          <Route path="/">
            <PatientList></PatientList>
          </Route>

          <Route path="/patient">
            <PatientForm></PatientForm>
          </Route>

          <Route path="/patient/:id" component={PatientForm}> </Route>

        </div>
      </div>
    </div>
  </main>
</Router>
