# FormGuardJS

A Form Validation Library that comes with it's own error messages.

## QuickStart

```html
<div class="formGuardErrors"></div>
<form>
  <div>
    <label> E-mail
      <input type="text" name="email">
    </label>
  </div>
  <div>
    <label>  Password
      <input type="text" name="password">
    </label>
  </div>
  <div>
    <label>  Remember Me?
      <input type="checkbox" name="remember">
    </label>
  </div>
  <div>
    <button type="submit">Login</button>
  </div>
</form>

<script src="./FormGuard.js" charset="utf-8"></script>
<script type="text/javascript">

var loginForm = document.querySelectorAll('form')[0];

function init () {

  window.formGuard = FormGuard.init( loginForm );

  formGuard.register( 'email', {
    required: true,
    type: 'email'
  })

  formGuard.register( 'password', {
    required: true,
    type: 'string',
    minimum: 8
  })

  loginForm.addEventListener( 'submit', loginFrmSbmtHndler);

}

function loginFrmSbmtHndler (event) {
  event.preventDefault();
  window
    .formGuard.validate()
      .then( function(){
        console.log(
          getLoginValues(loginForm)
          document.getElementsByClassName("formGuardErrors")[0].innerHTML = "Submitted Form";
        );
      })
          .catch(
            (value)=> console.log(value)
          )
    }

    // Login

    var loginBtn = document.getElementsByClassName('add')[0];

    function getLoginValues(form) {
      return {
        email: form.email ? form.email.value : '',
        password: form.password ? form.password.value : ''
      };
    }

    // Run on Ready
    function documentReady(fn) {
      if (document.readyState != 'loading'){
        fn();
      } else {
        document.addEventListener('DOMContentLoaded', fn);
      }
    }

    documentReady(init());
  </script>
```
