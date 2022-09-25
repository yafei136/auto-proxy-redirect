# Auto Redirect Proxy

A Chrome extension that automatically redirects scholarly database websites through EZProxy provided by the university.

There are two ways of achieving this:

* **Append Prefix**: "aaa.bb.cc/path" will be changed to "[proxy prefix]aaa.bbb.ccc/path".
* **Modify Host**: "aaa.bb.cc/path" will be changed to "aaa-bb-cc.[proxy host]/path". This currently does not work on http.

**Append Prefix** works well for most cases (see https://libproxy-db.org/), but directly modifying the host should also makes sense. I am not sure which one works best yet, so for now I write codes for both of them

TODOs:

- [ ] More preset database websites
- [ ] Improve the way redirection rules are updated
- [ ] Automatically fetch supported databases from the university's EZProxy server
- [ ] HTTP support for **Modify Host** mode
