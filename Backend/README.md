# Backend
Pyramid backend

# I'm on...
- [https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/logging.html](https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/logging.html)

# Chapter summaries
1. hello_world
- Start of the tutorial

2. package
- Learned about Python packages

3. ini
- Started using `pserve development.ini --reload` instead of running straight off of by `python app.py`

4. debugtoolbar
- Learned about `pyramid_debugtoolbar` floating thing that's kind of like inspect on Chrome

5. unit_testing
- Started unit testing using `unittest`
- `py.test tests.py -q`

6. views
- Added more URLs
- Removed view code from the startup code (__init__.py)

7. templating
- Finally have a view that is focused on Python code
- Started using `@view_config`

8. view_classes
- Changed the view functions to methods in a view class

9. request_response
- HTTP redirection
- Getting parameter from URL and change the response' content type and body then return the response

10. routing
- Learned rounting
- In __init__.py we changed the route declartion to `/howdy/{first}/{last}`
- `self.request.matchdict['first']` gives whatever was in that `{first}` part of the URL

11. jinja2
- Learned that Pyramid support different templating languages, such as Chameleon and Jinja2

12. static_assets
- Specified map requests under http://localhost.6543/static/ to files and directories inside a static directory inside our tutorial package
- `${request.static_url('tutorial:static/app.css')}`

13. json
- Used JSON renderer instead of Chameleon or Jinja2
- Added a route /howdy.json to an exact same view (overriding view)
- Files with the .pt extension are considered to be Chameleon templates.

14. more_view_classes
- Used POST
- Used parameter information in the request
- Centralized part of the view configuration to the class level with `@view_defaults`
