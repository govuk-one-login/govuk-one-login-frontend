# Header

###### For translations to work you __must__ pass in the `header: translations` varible
{% block header %}<br>
{{ frontendUiHeader<br>
  ({<br>
    header: translations<br>
  })<br>
  }}<br>
{% endblock %}


###### In order to remove the linking capability of the header logo and text include the `isEmbeddedMobileApp = true` variable within your repos basefile when you are calling the header

{% block header %}<br>
{{ frontendUiHeader<br>
  ({<br>
    isEmbeddedMobileApp = true<br>
  })<br>
  }}<br>
{% endblock %}

###### To enable the sign out functionality of the heade include the `signOutLink` variable within your repos basefile when calling the header

{% block header %}<br>
  {{ frontendUiHeader<br>
  ({<br>
    signOutLink: 'https://signin.account.gov.uk/signed-out'<br>
  })<br>
  }}<br>
{% endblock %}

