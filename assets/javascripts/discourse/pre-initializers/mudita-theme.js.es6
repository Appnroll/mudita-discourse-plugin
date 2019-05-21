import computed from "ember-addons/ember-computed-decorators"
import Category from "discourse/models/category"
import Topic from "discourse/models/topic"
import { ajax } from "discourse/lib/ajax"
import mobile from "discourse/lib/mobile"

export default {
  name: "mudita-theme",
  before: "inject-discourse-objects",
  initialize () {
    // Disable script checking if device is mobile or not
    mobile.init = () => {
      // overwrite init function
    }

    // Categories list plugins
    Category.reopen({
      // Category's last activity
      @computed("topics")
      last_activity (topics) {
        let lastBump = 0
        let text = ''
        if (topics && topics.length) {
          topics.forEach(topic => {
            const timestamp = new Date(topic.bumped_at).getTime()
            if (timestamp > lastBump) lastBump = timestamp
          })
        }
        if (lastBump > 0) {
          const diff = new Date().getTime() - lastBump
          const daysDiff = diff / 1000 / 60 / 60 / 24
          const date = new Date(lastBump)
          const time = `${date.getHours()}:${date.getMinutes()}`

          if (daysDiff < 1) {
            text = `Today, ${time}`
          } else if (daysDiff < 2) {
            text = `a day ago`
          } else if (daysDiff <= 31) {
            text = `${Math.floor(daysDiff)} days ago`
          } else {
            const day = date.getDay()
            const month = date.toUTCString().split(',')[1].split(' ')[2]
            const year = date.getFullYear().toString().slice(2, 4)
            text = `${month} ${day}, '${year}`
          }
        }
        return text
      },
      // Fix for last post author
      @computed("latestTopic.id")
      last_post_author (id) {
        let author = {}
        if (id) {
          return ajax(`/t/${id}.json`)
            .then(result => {
              author = result.details.created_by
              author.avatar_template = author.avatar_template.replace('{size}', 120)
              this.set('last_post_author', author)
            })
        }
      }
    })

    // Topics list plugins
    Topic.reopen({
      // Custom users list
      @computed("featuredUsers")
      custom_featured_users (users) {
        const max = 3
        const featuredUsers = []
        const usersCount = users.length < max ? users.length : max
        const left = users.length - usersCount
        for (let i = 0; i < usersCount; i++) {
          featuredUsers.push(users[i])
        }
        return {
          list: featuredUsers,
          left: left > 0 ? left : null
        }
      }
    })
  }
}
