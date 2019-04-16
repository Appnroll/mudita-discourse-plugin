# name: MuditaTheme
# about:
# version: 0.1
# authors: App'n'roll
# url: https://github.com/Appnroll


register_asset "stylesheets/common/mudita-theme.scss"


enabled_site_setting :mudita_theme_enabled

PLUGIN_NAME ||= "MuditaTheme".freeze

after_initialize do
  
  # see lib/plugin/instance.rb for the methods available in this context
  

  module ::MuditaTheme
    class Engine < ::Rails::Engine
      engine_name PLUGIN_NAME
      isolate_namespace MuditaTheme
    end
  end

  

  
  require_dependency "application_controller"
  class MuditaTheme::ActionsController < ::ApplicationController
    requires_plugin PLUGIN_NAME

    before_action :ensure_logged_in

    def list
      render json: success_json
    end
  end

  MuditaTheme::Engine.routes.draw do
    get "/list" => "actions#list"
  end

  Discourse::Application.routes.append do
    mount ::MuditaTheme::Engine, at: "/mudita-theme"
  end
  
end
