package omar.services.dashboard

class UrlMappings {

    static mappings = {
        "/"(controller: 'dashboard')
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

//        "/"(view: '/index')

        "500"(view: '/error')
        "404"(view: '/notFound')
    }
}
