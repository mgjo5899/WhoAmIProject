# Backend
Pyramid backend

# I'm on...
- [https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/jinja2.html](https://docs.pylonsproject.org/projects/pyramid/en/latest/quick_tutorial/jinja2.html)

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
