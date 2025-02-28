# Header

###### For translations to work you __must__ pass in the `header: translations` varible
```html
{% block header %}
{{ frontendUiHeader
  ({
    header: translations
  })
  }}
{% endblock %}
```

###### In order to remove the linking capability of the header logo and text include the `isEmbeddedMobileApp = true` variable within your repos basefile when you are calling the header
```html
{% block header %}
{{ frontendUiHeader
  ({
    isEmbeddedMobileApp = true
  })
  }}
{% endblock %}
```

###### To enable the sign out functionality of the heade include the `signOutLink` variable within your repos basefile when calling the header
```html
{% block header %}
  {{ frontendUiHeader
  ({
    signOutLink: 'https://signin.account.gov.uk/signed-out'
  })
  }}
{% endblock %}
```
